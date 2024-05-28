const { Timestamp } = require('bson');
const { builtinModules } = require('module');
const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const purchaseSchema = new Schema({

email:{
    type:String,
    required:true
},


transId:{
    type:String,
    required:true
},

},{timestamps:true})

const Purchase = mongoose.model('purchase',purchaseSchema);

module.exports = Purchase;