// import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
// Find all enrollments
export async function findAllEnrollments() {
    const enrollments = await model.find().populate("user").populate("course");
    return enrollments;
}

// Find enrollments for a specific user
export async function findEnrollmentsForUser(userId) {
  const enrollments = await model.find({ user: userId }).populate("course");
  return enrollments;
}

// Find enrollments for a specific course
export async function findEnrollmentsForCourse(courseId) {
  const enrollments = await model.find({ course: courseId }).populate("user");
  return enrollments;
}

// Find if a user is enrolled in a course
export async function findEnrollment(userId, courseId) {
  const enrollment = await model.findOne({ user: userId, course: courseId });
  return enrollment;
}

// Create enrollment
export async function enrollUserInCourse(user, course) {
  // First check if the enrollment already exists
  const existingEnrollment = await findEnrollment(user, course);
  if (existingEnrollment) {
    return existingEnrollment; // Return existing enrollment if found
  }
  
  // Create a new enrollment with current date and ENROLLED status
  const newEnrollment = { 
    user, 
    course, 
    _id: `${user}-${course}`,
    enrollmentDate: new Date(),
    status: "ENROLLED" 
  };
  return await model.create(newEnrollment);
}
 
 

// Remove enrollment by ID
export function unenrollUserFromCourse(user, course) {
  return model.deleteOne({ user, course });
 }
 
 

// Remove enrollment by userId and courseId
export async function unenrollUserFromCourseByIds(userId, courseId) {
  const result = await model.deleteOne({ user: userId, course: courseId });
  return {
    success: result.deletedCount > 0,
    deletedCount: result.deletedCount
  };
}

// Update enrollment status
export async function updateEnrollmentStatus(enrollmentId, status) {
  const result = await model.updateOne(
    { _id: enrollmentId },
    { $set: { status } }
  );
  return {
    success: result.modifiedCount > 0,
    modifiedCount: result.modifiedCount
  };
}

// Update enrollment grade
export async function updateEnrollmentGrade(enrollmentId, grade, letterGrade) {
  const result = await model.updateOne(
    { _id: enrollmentId },
    { $set: { grade, letterGrade } }
  );
  return {
    success: result.modifiedCount > 0,
    modifiedCount: result.modifiedCount
  };


  
}
export async function findCoursesForUser(userId) {
  const enrollments = await model.find({ user: userId }).populate("course");
  
  // Extract courses and add enrolled flag
  return enrollments.map(enrollment => {
    // Extract course from enrollment and add enrolled property
    const course = enrollment.course._doc ? enrollment.course._doc : enrollment.course;
    return {
      ...course,
      enrolled: true // Add enrolled flag
    };
  });
}
 // Find users enrolled in a specific course
export async function findUsersForCourse(courseId) {
  try {
    const enrollments = await model.find({ course: courseId })
      .populate("user")
      .exec();
    
    // If there are no enrollments, return an empty array
    if (!enrollments || enrollments.length === 0) {
      return [];
    }
    
    // Map the user from each enrollment, filtering out any undefined values
    return enrollments
      .map(enrollment => enrollment.user)
      .filter(user => user); // Remove any null/undefined users
  } catch (error) {
    console.error(`Error in findUsersForCourse for course ${courseId}:`, error);
    return []; // Return empty array on error for consistent client handling
  }
}
