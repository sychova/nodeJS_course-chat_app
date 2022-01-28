// Elements
const $messageForm = document.querySelector('#messageForm')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#sendLocation')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#messageTemplate').innerHTML
const locationTemplate = document.querySelector('#locationTemplate').innerHTML
const sidebarTemplate = document.querySelector('#sidebarTemplate').innerHTML

const roomMessagesRender = async (roomId) => {
    const response = await fetch(`/room/${roomId}/messages`)
    const messages = await response.json()
    messages.forEach((message) => {
        if (message.type == 'text') {
            messageRender(message)
        } else {
            locationRender(message)
        }
    })
}

const messageRender = ({ username, content, created_at, error }) => {
    if (error) {
        return alert(error)
    }

    const html = Mustache.render(messageTemplate, {
        username,
        message: content,
        createdAt: formatMessageCreatedAt(created_at),
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
}

const locationRender = (message) => {
    const html = Mustache.render(locationTemplate, {
        username: message.username,
        url: message.content,
        createdAt: formatMessageCreatedAt(message.createdAt),
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
}

const formatMessageCreatedAt = (time) => {
    return moment(time).format('h:mm A')
}

const autoscroll = () => {
    // New message
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const contentHeight = $messages.scrollHeight

    // How far have I scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (contentHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

const { username, room, roomId } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
})

const socket = io({
    query: {
        username,
        roomTitle: room,
    },
})

socket.on('roomData', ({ roomTitle, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        roomTitle,
        users,
    })
    document.querySelector('#sidebar').innerHTML = html
})

socket.on('message', messageRender)

socket.on('location', locationRender)

$messageForm.addEventListener('submit', (event) => {
    event.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = $messageFormInput.value

    socket.emit('message', message, () => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        console.log('Message delivered')
    })
})

$locationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $locationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit(
            'location',
            {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            },
            () => {
                $locationButton.removeAttribute('disabled')
                console.log('Location shared.')
            }
        )
    })
})

socket.on('connect_error', (error) => {
    alert(error)
    location.href = '/'
})

if (roomId) {
    document.addEventListener('DOMContentLoaded', roomMessagesRender(roomId))
}
