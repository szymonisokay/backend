const mongoose = require('mongoose')

const BookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookmarks: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Offer',
    default: [],
  },
})

module.exports = mongoose.model('Bookmark', BookmarkSchema)
