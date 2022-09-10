const credits = [
  {
    name: 'ADD2000',
    value: 2000,
  },
  {
    name: 'ADD10000',
    value: 10000,
  },
  {
    name: 'ADD20000',
    value: 20000,
  },
  {
    name: 'ADD40000',
    value: 40000,
  },
  {
    name: 'ADD100000',
    value: 100000,
  },
  {
    name: 'ADD1000000',
    value: 1000000,
  },
  {
    name: 'ADD100000000',
    value: 100000000,
  },
]

const getCreditsValue = (coupon) => {
  return credits.find((credit) => credit.name === coupon).value
}

const isCouponValid = (coupon) => {
  return !!credits.find((credit) => credit.name === coupon)
}

module.exports = {
  getCreditsValue,
  isCouponValid,
}
