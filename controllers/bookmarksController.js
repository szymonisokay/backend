const asyncHandler = require('express-async-handler')
const Bookmark = require('../models/bookmarkModel')

const addBookmark = asyncHandler(async (req, res) => {
  const usersBookmarksExists = await Bookmark.findOne({ user: req.user._id })

  if (usersBookmarksExists) {
    await Bookmark.updateOne(
      { user: req.user._id },
      { $addToSet: { bookmarks: req.body.id } }
    )

    return res
      .status(201)
      .json({ msg: 'Offer has been added to your bookmarks' })
  } else {
    const bookmarks = []
    bookmarks.push(req.body.id)

    const bookmark = {
      user: req.user._id,
      bookmarks,
    }

    await Bookmark.create(bookmark)

    return res
      .status(201)
      .json({ msg: 'Offer has been added to your bookmarks' })
  }
})

const removeBookmark = asyncHandler(async (req, res) => {
  const bookmarksExists = await Bookmark.findOne({ user: req.user._id })

  if (!bookmarksExists) {
    res.status(400)
    throw new Error('You are not authenticated')
  }

  await Bookmark.updateOne(
    { user: req.user._id },
    { $pull: { bookmarks: req.params.id } }
  )

  const updatedBookmarks = await Bookmark.findOne({
    user: req.user._id,
  }).populate('bookmarks')

  res.status(200).json({
    msg: 'Offer has been removed from your bookmarks',
    bookmarks: {
      results: updatedBookmarks.bookmarks,
      total: updatedBookmarks.bookmarks.length,
    },
  })
})

const getBookmarks = asyncHandler(async (req, res) => {
  const isUserWithBookmarks = await Bookmark.findOne({ user: req.user._id })

  const bookmarks = isUserWithBookmarks.bookmarks

  res.status(200).json({ bookmarks, total: bookmarks.length })
})

const getPopulatedBookmarks = asyncHandler(async (req, res) => {
  const isUserWithBookmarks = await Bookmark.findOne({
    user: req.user._id,
  }).populate('bookmarks')

  const bookmarks = isUserWithBookmarks.bookmarks

  // await Bookmark.populate(bookmarks, 'Bookmarks')

  res.status(200).json({ results: bookmarks, total: bookmarks.length })
})

module.exports = {
  addBookmark,
  removeBookmark,
  getBookmarks,
  getPopulatedBookmarks,
}
