const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors')

connectToMongo();
const app = express()
// const port = 3000 :: We cann't use it bcz our React App will be using this port.
const port = 5000

app.use(express.json())
app.use(cors({
  credentials: true,
  origin: process.env.FRONTEND
}))


app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})