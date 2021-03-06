const express = require('express')
const cors = require('cors')
require('dotenv').config()

const { connect } = require('./db')
const { errorHandler } = require('./middlewares/errorMiddleware')

const authRouter = require('./routes/authRoute')
const usersRouter = require('./routes/usersRoute')
const productsRouter = require('./routes/productsRoute')
const offersRouter = require('./routes/offersRoute')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/auth/', authRouter)
app.use('/api/users/', usersRouter)
app.use('/api/products/', productsRouter)
app.use('/api/offers/', offersRouter)

app.use(errorHandler)

app.listen(PORT, () => {
  connect()
  console.log(`Server is listening on port ${PORT}`)
})
