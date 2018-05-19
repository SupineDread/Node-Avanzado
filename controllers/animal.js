const fs = require('fs')
const path = require('path')
const User = require('../models/user')
const Animal = require('../models/animal')

const pruebas = (req, res) => {
  res.status(200).send({message: 'Hola'})
}

const saveAnimal = (req, res) => {
  let animal = new Animal()
  let params = req.body

  if(params.name){
    animal.name = params.name
    animal.description = params.description
    animal.year = params.year
    animal.image = null
    animal.user = req.user.sub

    animal.save((err, animalStored)=>{
      if (err) {
        res.status(500).send({message: 'Error al guardar el animal'})
      }else {
        if (!animalStored) {
          res.status(404).send({message: 'No hay animal por guardar'})
        }else {
          res.status(200).send({animalStored})
        }
      }
    })
  }else {
    res.status(200).send({message: 'El nombre del animal es obligatorio'})
  }
}

const getAnimals = (req, res) => {
  Animal.find({}).populate({path: 'user'}).exec ((err, animals)=>{
    if (err) {
      res.status(500).send({message: 'Error al obtener los animales'})
    }else{
      if (!animals) {
        res.status(404).send({message: 'No se han obtenido los animales'})
      }else {
        res.status(200).send({animals})
      }
    }
  })
}

function getAnimal(req, res){
  let animalId = req.params.id

  Animal.findById(animalId).populate({path: 'user'}).exec ((err, animal)=>{
    if (err) {
      res.status(500).send({message: 'Error al obtener el animal'})
    }else{
      if (!animal) {
        res.status(404).send({message: 'No se ha obtenido al animal'})
      }else {
        res.status(200).send({animal})
      }
    }
  })
}

function updateAnimal(req, res){
  let animalId = req.params.id
  let update = req.body

  Animal.findByIdAndUpdate(animalId, update, {new: true}, (err, animalUpdated)=>{
    if (err) {
      res.status(500).send({message: 'Error al actualizar el animal'})
    }else {
      if (!animalUpdated) {
        res.status(404).send({message: 'No se ha actualizado el animal'})
      }else {
        res.status(200).send({animalUpdated})
      }
    }
  })
}

const uploadImage = (req, res)=>{
  let animalId = req.params.id;
  let filename = 'No subido'

  if(req.files){
    let filepath = req.files.image.path
    let filesplit = filepath.split('\\')
    let filename = filesplit[2]
    let fileext = filename.split('\.')
    let ext =fileext[1]

    if(ext == 'png' || ext == 'jpg' || ext == 'jpeg' || ext == 'gif'){
      Animal.findByIdAndUpdate(animalId, {image: filename}, {new:true}, (err, animalUpdated)=>{
        if(err){
          res.status(500).send({message: 'Error al actualizar el usuario'})
        }else{
          if(!animalUpdated){
            res.status(404).send({message: 'No hay usuario actualizado'})
          }else{
            res.status(200).send({animalUpdated, filename})
          }
        }
      })
    }else{
      fs.unlink(filepath, (err)=>{
        if (err){
          res.status(200).send({message: 'No se ha eliminado el fichero no guardado'})
        }else {
          res.status(200).send({message: 'Extension no valida'})
        }
      })
    }
    //res.status(200).send({filepath, filesplit, filename, fileext, ext})
  }else{
    res.status(200).send({message: 'No hay archivos por subir'})
  }
}

const getImageFile = (req, res) => {
  let imagefile = req.params.imagefile
  let pathfile = './uploads/animals/'+imagefile
  fs.exists(pathfile, (exists)=>{
    if (exists) {
      res.sendFile(path.resolve(pathfile))
    }else{
      res.status(404).send({message: 'La imagen no existe'})
    }
  })
}

const deleteAnimal = (req, res) => {
  let animalId = req.params.id

  Animal.findByIdAndRemove(animalId, (err, animalDeleted)=>{
    if (err) {
      res.send({message: 'No se ha podido borra el animal'})
    }else {
      if (!animalDeleted) {
        res.send({message: 'No se ha borrado el animal'})
      }else{
        res.send({message: 'Se ha eliminado el animal correctamente'})
      }
    }
  })
}

module.exports = {
  pruebas,
  saveAnimal,
  getAnimals,
  getAnimal,
  updateAnimal,
  uploadImage,
  getImageFile,
  deleteAnimal
}
