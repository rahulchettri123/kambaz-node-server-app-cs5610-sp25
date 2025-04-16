import mongoose from "mongoose";
const schema = new mongoose.Schema({
  _id: String,
  name: String,
  number: String,
  description: String,
  startDate: Date,
  endDate: Date,
  department: String,
  credits: Number,
}, { collection: "courses" });
export default schema;

