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

  const offer = await Offer.create(req.body)

  res.status(201).json(offer)
})

const getOffers = asyncHandler(async (req, res) => {
  const { sort, limit, filters } = req.query

  console.log(filters)
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

  // switch(filters) {
  //   case
  // }

  const offers = await Offer.find(filterOption).sort(sortOption).limit(limit)

  res.status(200).json({ results: offers, total: offers.length })
})

const getOffer = asyncHandler(async (req, res) => {
  const { id: offerId } = req.params

  const offer = await Offer.findById(offerId)

  if (!offer) {
    res.status(400)
    throw new Error('Offer not found')
  }

  res.status(200).json({ result: offer, total: 1 })
})

module.exports = {
  createOffer,
  getOffers,
  getOffer,
}
