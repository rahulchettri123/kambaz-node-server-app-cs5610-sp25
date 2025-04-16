// In src/Kambaz/server/Kambaz/Enrollments/schema.js
import mongoose from "mongoose";
const enrollmentSchema = new mongoose.Schema(
 {
   _id: String,
   course: { type: String, ref: "CourseModel" },
   user:   { type: String, ref: "UserModel"   },
   grade: Number,
   letterGrade: String,
   enrollmentDate: Date,
   status: {
     type: String,
     enum: ["ENROLLED", "DROPPED", "COMPLETED"],
     default: "ENROLLED",
   },
 },
 { 
   collection: "enrollments",
   // Add toJSON transform to ensure consistent data structure
   toJSON: { 
     transform: function(doc, ret) {
       // Ensure enrolled flag is present
       if (ret.course && typeof ret.course === 'object') {
         ret.course.enrolled = true;
       }
       return ret;
     }
   }
 }
);
export default enrollmentSchema;