const express = require('express')
const multipart = require('connect-multiparty');
const animalController = require('../controllers/animal')
const api = express.Router()
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')

let md_upload = multipart({uploadDir: './uploads/animals'})

api.get('/pruebas', auth.ensureAuth, animalController.pruebas)
api.post('/animal', [auth.ensureAuth, admin.isAdmin], animalController.saveAnimal)
api.get('/animals', animalController.getAnimals)
api.get('/animal/:id', animalController.getAnimal)
api.put('/animal/:id', [auth.ensureAuth, admin.isAdmin], animalController.updateAnimal)
api.post('/animal/image/:id', [auth.ensureAuth, admin.isAdmin, md_upload], animalController.uploadImage)
api.get('/animal/image/:imagefile', animalController.getImageFile)
api.delete('/animal/:id', [auth.ensureAuth, admin.isAdmin], animalController.deleteAnimal)

module.exports = api
