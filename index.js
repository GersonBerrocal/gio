const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, '/tmp')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})
const upload = multer({ storage })
let files = []

const host = '192.168.100.4'
const port = 8080

let countComputer = 0
let countCell = 0

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/index.html')
})
app.get('/bulma/bulma.css', (req, res) => {
  res.sendFile(__dirname + '/node_modules/bulma/css/bulma.min.css')
})
app.get('api/files/download/:id', (req, res) => {
  res.send('Dale umpirri')
})
app.post('/api/files/upload', upload.single('fileShare'), (req, res) => {
  files.push({
    name: req.body.name,
    type: req.body.type,
    size: req.body.size,
    nameFile: req.file.filename,
    id: files.length
  })
  io.emit('upload', { files })
  res.json({ result: true })
})
app.get('/api/files', (req, res) => {
  res.json({ files })
})
app.use(express.static('src'))

io.on('connection', socket => {
  const userAgent = socket.handshake.headers['user-agent']
  let isMobile = /android/i.test(userAgent)
  if (isMobile) countCell++
  else countComputer++
  io.emit('setCount', { countCell, countComputer })

  socket.on('disconnect', () => {
    if (isMobile) countCell--
    else countComputer--
    io.emit('setCount', { countCell, countComputer })
  })
})

server.listen(port, host, () => {
  console.log('Servidor corriendo el puerto ' + port)
})
