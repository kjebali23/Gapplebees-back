const express = require('express')
const route = express.Router()
const profile = require('../../Services/Profile-service/profile');

route.get('/Profile' , profile.test );

module.exports = route