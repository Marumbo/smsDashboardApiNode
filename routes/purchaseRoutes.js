const express = require('express')

const { purchase_index, purchase_create_post} = require('../controllers/purchaseController')


const router = express.Router()


// get all messages

router.get('/all',purchase_index)

// add message

router.post('/create', purchase_create_post)
 
 module.exports = router;