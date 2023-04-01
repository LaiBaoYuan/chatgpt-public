import app from './src/client'
let port = process.env.PORT || 9000
app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
