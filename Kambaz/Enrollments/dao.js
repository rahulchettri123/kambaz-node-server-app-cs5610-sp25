import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

// Find all enrollments
export function findAllEnrollments() {
  return Database.enrollments;
}

// Find enrollments for a specific user
export function findEnrollmentsForUser(userId) {
  return Database.enrollments.filter(
    enrollment => enrollment.user === userId
  );
}

// Find enrollments for a specific course
export function findEnrollmentsForCourse(courseId) {
  return Database.enrollments.filter(
    enrollment => enrollment.course === courseId
  );
}

// Find if a user is enrolled in a course
export function findEnrollment(userId, courseId) {
  return Database.enrollments.find(
    enrollment => enrollment.user === userId && enrollment.course === courseId
  );
}

// Create enrollment
export function enrollUserInCourse(userId, courseId) {
  const enrollment = { _id: uuidv4(), user: userId, course: courseId };
  Database.enrollments.push(enrollment);
  return enrollment;
}

// Remove enrollment
export function unenrollUserFromCourse(enrollmentId) {
  const originalLength = Database.enrollments.length;
  Database.enrollments = Database.enrollments.filter(
    enrollment => enrollment._id !== enrollmentId
  );
  return {
    success: originalLength > Database.enrollments.length,
    deletedCount: originalLength - Database.enrollments.length
  };
}

// Remove enrollment by userId and courseId
export function unenrollUserFromCourseByIds(userId, courseId) {
  const enrollment = findEnrollment(userId, courseId);
  if (enrollment) {
    return unenrollUserFromCourse(enrollment._id);
  }
  return { success: false, deletedCount: 0 };
}