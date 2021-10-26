const log = document.getElementById('log')
function clog(data) {
  log.innerHTML = data
}

let isMobile = false
const inputFile = document.getElementById('inputFile')
const fileName = document.getElementById('fileName')
const countCell = document.getElementById('countCell')
const countComputer = document.getElementById('countComputer')
// eslint-disable-next-line no-undef
const socket = io()

if (/android/i.test(navigator.userAgent)) {
  isMobile = true
}

inputFile.addEventListener('change', () => {
  if (inputFile.files.length) {
    const name = inputFile.files[0].name
    fileName.textContent = name
  }
})

socket.on('setCount', data => {
  countCell.textContent = data.countCell
  countComputer.textContent = data.countComputer
})
