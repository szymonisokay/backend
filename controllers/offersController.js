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
  const { type, location, minPrice, maxPrice, minArea, maxArea, sort } =
    req.query

  let query = {}

  if (type === 'rent') {
    query.is_for_rent = true
  }

  if (location) {
    query.$or = [
      { 'location.street': { $regex: location, $options: 'i' } },
      { 'location.city': { $regex: location, $options: 'i' } },
      { 'location.country': { $regex: location, $options: 'i' } },
    ]
  }

  if (minPrice !== '0' && type === 'rent') {
    query.price_month = {
      ...query.price_month,
      $gte: minPrice,
    }
  } else if (minPrice !== '0' && type === 'purchase') {
    query.price = {
      ...query.price,
      $gte: minPrice,
    }
  }

  if (maxPrice !== '0' && type === 'rent') {
    query.price_month = {
      ...query.price_month,
      $lte: maxPrice,
    }
  } else if (maxPrice !== '0' && type === 'purchase') {
    query.price = {
      ...query.price,
      $lte: maxPrice,
    }
  }

  if (minArea !== '0') {
    query.area = {
      ...query.area,
      $gte: minArea,
    }
  }

  if (maxArea !== '0') {
    query.area = {
      ...query.area,
      $lte: maxArea,
    }
  }

  let sortOptions = {}

  switch (sort) {
    case 'newest':
      sortOptions = { createdAt: -1 }
      break
    case 'price_asc':
      sortOptions = { price: 1 }
      break
    case 'price_desc':
      sortOptions = { price: -1 }
      break
  }

  const offers = await Offer.find(query)
    .where('is_published', true)
    .sort(sortOptions)

  res.status(200).json({ results: offers, total: offers.length })
})

const getOffer = asyncHandler(async (req, res) => {
  const { id: offerId } = req.params
  const isOffer = await Offer.findOne({ _id: offerId, user: req.user._id })

  if (!isOffer) {
    res.status(401)
    throw new Error('Access denied')
  }

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

const getUserOffers = asyncHandler(async (req, res) => {
  const { id: userId } = req.params

  const offers = await Offer.find({ user: userId })

  res.status(200).json({ results: offers, total: offers.length })
})

const updateOffer = asyncHandler(async (req, res) => {
  const { id } = req.params

  const offer = await Offer.findOne({ _id: id, user: req.user._id })

  if (!offer) {
    res.status(401)
    throw new Error('Access denied')
  }

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

const deleteOffer = asyncHandler(async (req, res) => {
  const { id } = req.params
  const isOffer = await Offer.findOne({ _id: id, user: req.user._id })

  if (!isOffer) {
    res.status(401)
    throw new Error('Access denied')
  }

  await Offer.findByIdAndDelete(id)

  const offers = await Offer.find({ user: req.user._id })

  res
    .status(200)
    .json({
      msg: 'Offer deleted',
      offers: { results: offers, total: offers.length },
    })
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
  getUserOffers,
  updateOffer,
  deleteOffer,
  deleteAll,
  uploadImage,
}
