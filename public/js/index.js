document.addEventListener("DOMContentLoaded", async() => {
	await getRoomsList()
});

const roomsTemplate = document.querySelector('#roomsTemplate')
const roomsList = document.querySelector('#roomsList')
const room = document.querySelector('#room')

const getRoomsList = async () => {
	const response = await fetch('/rooms')
	const rooms = await response.json()
	const html = Mustache.render(roomsTemplate.innerHTML, { rooms })
	document.querySelector('#roomsList').innerHTML = html
}

room.addEventListener('change', (event) => {
	room.setAttribute('value', event.target.value)
})
