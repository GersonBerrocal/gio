const express = require('express')
const app = express()

const host = '192.168.100.4'
const port = 8080

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

app.listen(port, host, () => {
  console.log('Servidor corriendo el puerto ' + port)
})
