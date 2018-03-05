const mongoose = require('mongoose')

const AnimalSchema = mongoose.Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  year: {
    type: Number
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  image: {
    type: String
  }
})

module.exports = mongoose.model('Animal', AnimalSchema)
