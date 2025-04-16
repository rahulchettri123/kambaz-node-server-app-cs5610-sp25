// src/Kambaz/server/Kambaz/Assignments/schema.js
import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    course: { type: String, ref: "CourseModel" },
    availableDate: String,
    dueDate: String,
    availableUntil: String,
    points: Number,
    submissionType: String,
    description: String
  },
  { collection: "assignments" }
);

export default assignmentSchema;