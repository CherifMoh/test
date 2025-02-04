import mongoose from "mongoose"; 

const WilayaSchema = new mongoose.Schema({
  code: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
    max: 58
  },
  name: {
    type: String,
    required: true,
    unique: true
  }
});

const Wilaya = mongoose.models.Wilaya ||mongoose.model('Wilaya', WilayaSchema)

export default Wilaya