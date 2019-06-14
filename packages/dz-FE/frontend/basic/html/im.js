const http = require('http')
const url = require('url')

http.createServer((req, res) => {
  const uri = url.parse(req.url).pathname
  if (uri === '/test') {
    let data
    const mytime = setInterval(() => {
      data = getData()
      if (data > 0.8) {
        clearInterval(mytime)
        const json = JSON.stringify({
          data: data
        })
        res.end(json)
      }
    }, 2000)
    setTimeout(() => {
      const json = JSON.stringify({
        data: 'never 0.8 or larger'
      })
      clearInterval(mytime)
      res.end(json)
    }, 10000);
  }
}).listen(4001)

getData = () => {
  const m = Math.random()
  console.log(m)
  return m
}

