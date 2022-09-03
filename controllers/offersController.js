const asyncHandler = require('express-async-handler')
const Offer = require('../models/offerModel')

const createOffer = asyncHandler(async (req, res) => {
  // const {
  //   title,
  //   description,
  //   area,
  //   land_area,
  //   price,
  //   property_type,
  //   construction_year,
  //   is_parking,
  //   images: { featured },
  //   available,
  //   location: {
  //     country,
  //     city,
  //     street,
  //     zip_code,
  //     coords: { lat, lng },
  //   },
  //   surroundings,
  //   nearby,
  // } = req.body
  // if (
  //   !title ||
  //   !description ||
  //   !area ||
  //   !land_area ||
  //   !price ||
  //   !property_type ||
  //   !construction_year ||
  //   !is_parking ||
  //   !featured ||
  //   !available ||
  //   !country ||
  //   !city ||
  //   !street ||
  //   !zip_code ||
  //   !lat ||
  //   !lng ||
  //   !surroundings ||
  //   !nearby
  // ) {
  //   res.status(400)
  //   throw new Error('Please provide all data')
  // }

  // const parsedPath = req.file.path.split('\\').join('/')

  const newOffer = {
    ...req.body,
    is_published: true,
    user: req.user._id,
  }

  const offer = await Offer.create(newOffer)

  res.status(201).json({ msg: 'Offer created successfully', offer })
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
  const offers = await Offer.find({})
    .where('is_published', true)
    .sort({ createdAt: -1 })
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

const updateOffer = asyncHandler(async (req, res) => {
  const { id } = req.params

  const body = {
    ...req.body,
    is_published: true,
  }

  const updatedOffer = await Offer.findByIdAndUpdate(id, body, {
    new: true,
  })

  res
    .status(201)
    .json({ msg: 'Offer updated successfully', offer: updatedOffer })
})

const deleteAll = asyncHandler(async (req, res) => {
  if (!req.user.is_admin) {
    res.status(401)
    throw new Error('Access denied')
  }

  await Offer.deleteMany()

  res.status(200).json('Deleted')
})

const uploadImage = asyncHandler(async (req, res) => {
  const { is_featured } = JSON.parse(req.body.imageData)

  const parsedPath = req.file.path.split('\\').join('/')

  const file = {
    ...req.file,
    path: parsedPath,
  }

  res.status(201).json({ msg: 'Image uploaded', file, is_featured })
})

module.exports = {
  createOffer,
  getOffers,
  getOffer,
  updateOffer,
  deleteAll,
  uploadImage,
}
