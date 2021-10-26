const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

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
app.get('/imagenes/imagen.jpg', (req, res) => {
  res.sendFile('/tmp/user.jpg')
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
