const path = require('path')
const express = require('express')
const ehbs = require('express-handlebars')
const app = express()
const port = 3010

// middleware
app.use((request, response, next) => {
  request.extra = 'extra things added through middleware'
  console.log(request.headers)
  next()
})

app.use((err, request, response, next) => {
  console.log('something bad happens', err)
  response.status(500).send('Something broke!')
})

app.engine('.hbs', ehbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts')
}))

app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (request, response) => {
  // response.send('hello express')
  // response.json({
  //   extra: request.extra
  // })
  response.render('home', {
    name: 'John'
  })
})

app.listen(port, (err) => {
  if (err) {
    console.log('something bad happens', err)
  }
})
