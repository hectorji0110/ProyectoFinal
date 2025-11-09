import mongoose from 'mongoose';

// Conectar a MongoDB
const connection = mongoose.connect('mongodb://localhost:27017/ProyectoFinal')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

export default connection;