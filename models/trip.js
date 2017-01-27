const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let TripSchema = new Schema({
  country: {
    type: String,
    // required: true,
  },
  packageNumber: {
    type: Number,
  }
})

 module.exports = mongoose.model("Trip", TripSchema);
