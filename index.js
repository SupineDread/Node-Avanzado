const config = require('./config')
const app = require('./app')
const mongoose = require('mongoose')

mongoose.Promise = Promise
mongoose.connect(config.db, {useMongoClient: true}).then(()=>{
  console.log(`Conectao a ${config.db}`);
  app.listen(config.port, ()=>{
    console.log(`El servidor se ha iniciado en el puerto ${config.port}`);
  })
}).catch(err=>{
  console.log(err);
})
