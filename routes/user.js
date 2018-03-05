const express = require('express')
const multipart = require('connect-multiparty');
const userController = require('../controllers/user')
const api = express.Router()
const auth = require('../middlewares/auth')

let md_upload = multipart({uploadDir: './uploads/users'})

api.get('/pruebas', auth.ensureAuth, userController.pruebas)
api.post('/register', userController.register)
api.post('/login', userController.login)
api.put('/user/:id', auth.ensureAuth, userController.updateUser)
api.post('/user/image/:id', [auth.ensureAuth, md_upload], userController.uploadImage)
api.get('/user/image/:imagefile', userController.getImageFile)
api.get('/user/keepers', userController.getKeepers)

module.exports = api
