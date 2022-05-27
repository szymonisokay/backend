const mongoose = require('mongoose')

const connect = () => {
  mongoose.connect(process.env.MONGO_URI, () => console.log('Connected to DB'))
}

module.exports = {
  connect,
}
