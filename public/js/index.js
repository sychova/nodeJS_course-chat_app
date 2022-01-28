const roomsTemplate = document.querySelector('#roomsTemplate')
const roomsList = document.querySelector('#roomsList')
const room = document.querySelector('#room')

const getRoomsList = async () => {
    const response = await fetch('/rooms')
    const rooms = await response.json()
    if (rooms === undefined) {
        return (document.querySelector('#roomsList').innerHTML = '')
    }
    const html = Mustache.render(roomsTemplate.innerHTML, rooms)
    document.querySelector('#roomsList').innerHTML = html
}

room.addEventListener('input', (event) => {
    const input = event.target
    const list = input.getAttribute('list')
    const options = document.querySelectorAll('#' + list + ' option')
    const hiddenInput = document.getElementById(
        input.getAttribute('id') + '-hidden'
    )
    const inputValue = input.value

    hiddenInput.value = inputValue

    for (var i = 0; i < options.length; i++) {
        if (options[i].innerText === inputValue) {
            hiddenInput.value = options[i].getAttribute('data-value')
            break
        }

        hiddenInput.value = null
    }
})

document.addEventListener('DOMContentLoaded', getRoomsList)
