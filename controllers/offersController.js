const asyncHandler = require('express-async-handler')
const Offer = require('../models/offerModel')

const createOffer = asyncHandler(async (req, res) => {
  const {
    title,
    body_html,
    area,
    usable_area,
    price,
    price_m2,
    rooms_num,
    images: { featured },
    available,
  } = req.body

  if (
    !title ||
    !body_html ||
    !area ||
    !usable_area ||
    !price ||
    !price_m2 ||
    !rooms_num ||
    !featured ||
    !available
  ) {
    res.status(400)
    throw new Error('Please provide all data')
  }

  const newOffer = {
    ...req.body,
    user: req.user._id,
  }

  const offer = await Offer.create(newOffer)

  res.status(201).json(offer)
})

const getOffers = asyncHandler(async (req, res) => {
  const { sort, limit, filters, page } = req.query

  let sortOption = {}

  switch (sort) {
    case 'price_asc':
      sortOption = { price: 1 }
      break
    case 'price_desc':
      sortOption = { price: -1 }
      break
    case 'newest':
      sortOption = { createdAt: -1 }
      break
  }

  let filterOption = {}

  const skip = (page - 1) * limit

  const allOffersCount = await Offer.estimatedDocumentCount()
  const offers = await Offer.find(filterOption)
    .sort(sortOption)
    .limit(limit)
    .skip(skip)

  res.status(200).json({ results: offers, total: allOffersCount })
})

const getOffer = asyncHandler(async (req, res) => {
  const { id: offerId } = req.params

  const offer = await Offer.findById(offerId).populate({
    path: 'user',
    select: '-password -is_admin -__v',
  })

  if (!offer) {
    res.status(400)
    throw new Error('Offer not found')
  }

  res.status(200).json({ results: offer, total: 1 })
})

const deleteAll = asyncHandler(async (req, res) => {
  if (!req.user.is_admin) {
    res.status(401)
    throw new Error('Access denied')
  }

  await Offer.deleteMany()

  res.status(200).json('Deleted')
})

module.exports = {
  createOffer,
  getOffers,
  getOffer,
  deleteAll,
}
