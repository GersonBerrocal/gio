const log = document.getElementById('log')
function clog(data) {
  log.innerHTML = data
}

let isMobile = false
const inputFile = document.getElementById('inputFile')
const fileName = document.getElementById('fileName')
if (/android/i.test(navigator.userAgent)) {
  isMobile = true
}
inputFile.addEventListener('change', e => {
  console.log(inputFile.files)
  const name = inputFile.files[0].name
  fileName.textContent = name
})
