mongoose = require 'mongoose'
Schema = mongoose.Schema
ObjectId = Schema.ObjectId

orderSchema = new Schema
  timestamp: Date
  
  position: String

  visible: Number

  price: Number

  market: String

  tif: String

  trader: ObjectId

module.exports = mongoose.model 'Order', orderSchema