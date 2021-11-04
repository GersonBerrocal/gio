const inputFile = document.getElementById('inputFile')
const fileName = document.getElementById('fileName')
const countCell = document.getElementById('countCell')
const countComputer = document.getElementById('countComputer')
const btnSubir = document.getElementById('btnSubir')
const fileInfo = document.getElementById('fileInfo')
const formFile = document.getElementById('formFile')
const containerFiles = document.getElementById('containerFiles')
let lastFileData = []
// eslint-disable-next-line no-undef
const socket = io()

btnSubir.setAttribute('disabled', 'disabled')

inputFile.addEventListener('change', () => {
  if (inputFile.files.length) {
    btnSubir.removeAttribute('disabled')
    const file = inputFile.files[0]
    fileName.textContent = file.name
    let type = file.type
    let [size, measure] = verifySizeFile(file.size)
    type = verifyTypeFile(type)
    const fileData = {
      name: file.name,
      size: [size, measure],
      type: type
    }
    lastFileData.push(fileData)
    setFileInfo(fileData)
  }
})
formFile.addEventListener('submit', async e => {
  e.preventDefault()
  if (!inputFile.files.length) return
  const formData = new FormData()
  formData.append('fileShare', formFile['file'].files[0])
  formData.append('name', lastFileData[0].name)
  formData.append('size', lastFileData[0].size)
  formData.append('type', lastFileData[0].type)
  const res = await fetch('/api/files/upload', {
    method: 'POST',
    body: formData
  })
  const resObject = await res.json()
  console.log(resObject.result)
  lastFileData = []
  resetInputFile()
})

function resetInputFile() {
  inputFile.value = null
  fileInfo.innerHTML = ''
  fileName.textContent = '...'
  btnSubir.setAttribute('disabled', 'disabled')
}

function verifySizeFile(size) {
  let measure = ''
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
  return [size.toFixed(2), measure]
}

function verifyTypeFile(type) {
  if (/video/i.test(type)) type = 'video'
  else if (/image/i.test(type)) type = 'imagen'
  else if (
    type == 'text/plain' ||
    type == 'application/pdf' ||
    /office/i.test(type)
  )
    type = 'documento'
  else type = 'otros'

  return type
}

function setFileInfo(fileData) {
  fileInfo.innerHTML = `
  <div class="my-3">  
  <p><b>Nombre : </b>${fileData.name}</p>
  <p><b>Size :</b>${fileData.size[0]} ${fileData.size[1]}</p>
  <p><b>Tipo : </b>${fileData.type}</p>
  </div>
  `
}

async function getDataFiles() {
  const res = await fetch('/api/files', { method: 'GET' })
  const resJson = await res.json()
  if (resJson.files.length < 1) return ''
  setFiles(resJson.files)
}

function setFiles(arrayFiles) {
  let template = ``
  arrayFiles.forEach(file => {
    template += `<a class="panel-block">
                  <span class="panel-icon">
                    <i class="fas fa-book" aria-hidden="true"></i>
                  </span>
                    ${file.name}
                  </a>`
  })
  containerFiles.innerHTML = template
}

socket.on('setCount', data => {
  countCell.textContent = data.countCell
  countComputer.textContent = data.countComputer
})

socket.on('upload', data => {
  setFiles(data.files)
})

getDataFiles()
