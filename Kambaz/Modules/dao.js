import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
export function deleteModule(moduleId) {
   return model.deleteOne({ _id: moduleId });
   }
   
export function createModule(module) {
  const newModule = { ...module, _id: uuidv4() };
  return model.create(newModule);
  // Database.modules = [...Database.modules, newModule];
  // return newModule;
}
export function updateModule(moduleId, moduleUpdates) {
  return model.updateOne({ _id: moduleId }, moduleUpdates);
  }
  
export function findModulesForCourse(courseId) {
  return model.find({ course: courseId });
}

// Add a lesson to a module
export async function addLessonToModule(moduleId, lesson) {
  const newLesson = {
    ...lesson,
    _id: uuidv4(),
    module: moduleId
  };
  
  // Find the module and push the new lesson to its lessons array
  const result = await model.updateOne(
    { _id: moduleId },
    { $push: { lessons: newLesson } }
  );
  
  if (result.modifiedCount === 1) {
    // Return the updated module
    const updatedModule = await model.findById(moduleId);
    return {
      success: true,
      module: updatedModule,
      lesson: newLesson
    };
  } else {
    return {
      success: false,
      message: "Module not found or lesson could not be added"
    };
  }
}

// Get a module by ID
export async function findModuleById(moduleId) {
  return model.findById(moduleId);
}
