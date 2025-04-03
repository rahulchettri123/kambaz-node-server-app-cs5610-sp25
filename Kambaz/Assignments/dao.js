import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

// Find all assignments
export function findAllAssignments() {
  return Database.assignments;
}

// Find assignments for a specific course
export function findAssignmentsForCourse(courseId) {
  return Database.assignments.filter(assignment => assignment.course === courseId);
}

// Find an assignment by ID
export function findAssignmentById(assignmentId) {
  return Database.assignments.find(assignment => assignment._id === assignmentId);
}

// Create a new assignment
export function createAssignment(assignment) {
  const newAssignment = { ...assignment, _id: uuidv4() };
  Database.assignments = [...Database.assignments, newAssignment];
  return newAssignment;
}

// Update an assignment
export function updateAssignment(assignmentId, assignmentUpdates) {
  const assignment = Database.assignments.find(a => a._id === assignmentId);
  if (assignment) {
    Object.assign(assignment, assignmentUpdates);
    return { acknowledged: true, modifiedCount: 1 };
  }
  return { acknowledged: false, modifiedCount: 0 };
}

// Delete an assignment
export function deleteAssignment(assignmentId) {
  const originalLength = Database.assignments.length;
  Database.assignments = Database.assignments.filter(a => a._id !== assignmentId);
  const newLength = Database.assignments.length;
  return { 
    acknowledged: true, 
    deletedCount: originalLength > newLength ? 1 : 0 
  };
}