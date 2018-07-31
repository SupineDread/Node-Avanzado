const bcrypt = require('bcrypt-nodejs')
const fs = require('fs')
const path = require('path');
const User = require('../models/user')
const jwt = require('../services/jwt')

const pruebas = (req, res) => {
  res.status(200).send({message: 'Hola', user:  req.user})
}

const register = (req, res)=>{
  let user = new User()
  let params = req.body
  if(params.password && params.name && params.email && params.surname){
    user.name = params.name
    user.surname = params.surname
    user.email = params.email
    user.role = 'ROLE_USER'
    user.image = null
    User.findOne({email:  user.email.toLowerCase()}, (err, issetUser)=>{
      if(err){
        res.status(500).send({message: 'Error al comprobar el usuario'})
      }else{
        if(!issetUser){
          bcrypt.hash(params.password, null, null, (err, hash)=>{
            user.password = hash
            user.save((err, userStored)=>{
              if (err) {
                res.status(500).send({message: 'Se ha producido un error el guardar el usuario'})
              }else{
                if (!userStored){
                  res.status(404).send({message: 'No se ha encntrado el usuario'})
                }else{
                  res.status(200).send({userStored})
                }
              }
            })
          })
        }else{
          res.status(200).send({message: 'El usuario ya existe'})
        }
      }
    })
  }else{
    res.status(200).send({message: 'Faltan datos para poder guardar'})
  }
}

const login = (req, res)=>{
  let params = req.body
  let email = params.email
  let password = params.password
  User.findOne({email: email.toLowerCase()}, (err, user)=>{
    if(err){
      res.status(500).send({message: 'Error al buscar el usuario'})
    }else{
      if(user){
        bcrypt.compare(password, user.password, (err, check)=>{
          if (err) {
            console.log(err);
          }
          if (check) {
            if(params.getToken){
              res.status(200).send({token: jwt.createToken(user)})
            }else{
              res.status(200).send({user})
            }
          }else{
            res.status(404).send({message: 'El usuario no ha podido loguearse correctamente'})
          }
        })
      }else{
        res.status(404).send({message: 'Usuario no encontrado'})
      }
    }
  })
}

const updateUser = (req, res)=>{
  let userid = req.params.id
  var update = req.body
  delete update.password

  if(userid != req.user.sub){
    return res.status(403).send({message: "No tienes permiso para editar este perfil"})
  }

  User.findByIdAndUpdate(userid, update, {new:true}, (err, user)=>{
    if(err){
      res.status(500).send({message: 'Error al actualizar el usuario'})
    }else{
      if(!user){
        res.status(404).send({message: 'No hay usuario actualizado'})
      }else{
        res.status(200).send({user})
      }
    }
  })
}

const uploadImage = (req, res)=>{
  let userid = req.params.id;
  let filename = 'No subido'

  if(req.files){
    let filepath = req.files.image.path
    let filesplit = filepath.split('\\')
    let filename = filesplit[2]
    let fileext = filename.split('\.')
    let ext =fileext[1]

    if(ext == 'png' || ext == 'jpg' || ext == 'jpeg' || ext == 'gif'){
      if(userid != req.user.sub){
        return res.status(403).send({message: "No tienes permiso para editar este perfil"})
      }
      User.findByIdAndUpdate(userid, {image: filename}, {new:true}, (err, user)=>{
        if(err){
          res.status(500).send({message: 'Error al actualizar el usuario'})
        }else{
          if(!user){
            res.status(404).send({message: 'No hay usuario actualizado'})
          }else{
            res.status(200).send({user, filename})
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
  let pathfile = './uploads/users/'+imagefile
  fs.exists(pathfile, (exists)=>{
    if (exists) {
      res.sendFile(path.resolve(pathfile))
    }else{
      res.status(404).send({message: 'La imagen no existe'})
    }
  })
}

const getKeepers =  (req, res) => {
  User.find({role: 'ROLE_ADMIN'}).exec((err, keepers)=>{
    if (err) {
      res.status(500).send({message: 'No ha sido posible obtener los cuidadores'})
    }else{
      if (!keepers) {
        res.status(404).send({message: 'No hay cuidadores'})
      }else{
        res.status(200).send({keepers})
      }
    }
  })
}

module.exports = {
  pruebas,
  register,
  login,
  updateUser,
  uploadImage,
  getImageFile,
  getKeepers
}
