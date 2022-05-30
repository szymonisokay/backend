const Product = require('../models/productModel')
const asyncHandler = require('express-async-handler')

const createProduct = asyncHandler(async (req, res) => {
  const { title, body_html, product_category, available_qty, price } = req.body

  if (!title || !body_html || !product_category || !available_qty || !price) {
    res.status(400)
    throw new Error('Please provide all data')
  }

  if (!req.user.is_admin) {
    res.status(401)
    throw new Error('Access denied')
  }

  const product = await Product.create(req.body)

  res.status(201).json(product)
})

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})

  res.status(200).json(products)
})

const getProduct = asyncHandler(async (req, res) => {
  const { id: productId } = req.params

  const product = await Product.findById(productId)

  if (!product) {
    res.status(400)
    throw new Error('Product not found')
  }

  res.status(200).json(product)
})

const updateProduct = asyncHandler(async (req, res) => {
  const { id: productId } = req.params

  if (!req.user.is_admin) {
    res.status(401)
    throw new Error('Access denied')
  }

  let productData

  switch (req.body.price_unit) {
    case 'USD':
      productData = {
        ...req.body,
        price_symbol: '$',
      }

      break
    case 'EUR':
      productData = {
        ...req.body,
        price_symbol: '€',
      }

      break
    case 'PLN':
      productData = {
        ...req.body,
        price_symbol: 'zł',
      }

      break
  }

  const product = await Product.findByIdAndUpdate(productId, productData, {
    new: true,
  })

  if (!product) {
    res.status(400)
    throw new Error('Product not found')
  }

  res.status(200).json(product)
})

const deleteProduct = asyncHandler(async (req, res) => {
  const { id: productId } = req.params

  if (!req.user.is_admin) {
    res.status(401)
    throw new Error('Access denied')
  }

  const product = await Product.findByIdAndDelete(productId)

  if (!product) {
    res.status(400)
    throw new Error('Product not found')
  }

  res.status(200).json(product)
})

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
}
