const log = document.getElementById('log')
function clog(data) {
  log.innerHTML = data
}

let isMobile = false
const inputFile = document.getElementById('inputFile')
const fileName = document.getElementById('fileName')
const countCell = document.getElementById('countCell')
const countComputer = document.getElementById('countComputer')
const btnSubir = document.getElementById('btnSubir')
const fileInfo = document.getElementById('fileInfo')
// eslint-disable-next-line no-undef
const socket = io()

if (/android/i.test(navigator.userAgent)) {
  isMobile = true
}

inputFile.addEventListener('change', () => {
  if (inputFile.files.length) {
    btnSubir.removeAttribute('disabled')
    const file = inputFile.files[0]
    fileName.textContent = file.name
    let measure = ''
    let size = file.size
    let type = file.type
    if (size < 1000) measure = 'bytes'
    else if (size < 1000000) {
      measure = 'KB'
      size = size / 1000
    } else if (size < 1000000000) {
      measure = 'MB'
      size = size / 1000000
    } else {
      measure = 'GB'
      size = size / 1000000000
    }
    if (/video/i.test(type)) type = 'video'
    else if (/image/i.test(type)) type = 'imagen'
    else if (
      type == 'text/plain' ||
      type == 'application/pdf' ||
      /office/i.test(type)
    )
      type = 'documento'
    else type = 'otros'

    const fileData = {
      name: file.name,
      size: [size.toFixed(2), measure],
      type: type
    }
    setFileInfo(fileData)
  }
})
function setFileInfo(fileData) {
  fileInfo.innerHTML = `
  <div class="my-3">  
  <p><b>Nombre : </b>${fileData.name}</p>
  <p><b>Size :</b>${fileData.size[0]} ${fileData.size[1]}</p>
  <p><b>Tipo : </b>${fileData.type}</p>
  </div>
  `
}

socket.on('setCount', data => {
  countCell.textContent = data.countCell
  countComputer.textContent = data.countComputer
})
