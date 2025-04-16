// src/Kambaz/server/Kambaz/Assignments/dao.js
import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

// Find all assignments
export async function findAllAssignments() {
  const assignments = await model.find();
  return assignments;
}

// Find assignment by ID
export async function findAssignmentById(assignmentId) {
  const assignment = await model.findById(assignmentId);
  return assignment;
}

// Find assignments for a specific course
export async function findAssignmentsForCourse(courseId) {
  const assignments = await model.find({ course: courseId });
  return assignments;
}

// Create a new assignment
export async function createAssignment(assignment) {
  const newAssignment = { 
    ...assignment, 
    _id: assignment._id || uuidv4()
  };
  return await model.create(newAssignment);
}

// Update an existing assignment
export async function updateAssignment(assignmentId, assignment) {
  const status = await model.updateOne(
    { _id: assignmentId },
    { $set: assignment }
  );
  return status;
}

// Delete an assignment
export async function deleteAssignment(assignmentId) {
  const status = await model.deleteOne({ _id: assignmentId });
  return status;
}