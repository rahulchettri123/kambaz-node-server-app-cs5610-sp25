import db from "../Database/index.js";
import model from "./model.js";

import { v4 as uuidv4 } from "uuid";
let { users } = db;

export const createUser = (user) => {
  const newUser = { ...user, _id: uuidv4() };
  return model.create(newUser);
}


export const findAllUsers = () => model.find();
export const findUserById = (userId) => model.findById(userId);
export const findUserByUsername = (username) => model.findOne({ username: username });
export const findUserByCredentials
= (username, password) => model.findOne({ username, password });
export const updateUser = (userId, user) => model.updateOne({ _id: userId },
{ $set: user });

export const deleteUser = (userId) => model.deleteOne({ _id: userId });
export const findUsersByRole
    = (role) => model.find({ role: role });
    export const findUsersByPartialName = (partialName) => {
      const regex = new RegExp(partialName, "i");
      // 'i' makes it case-insensitive
      return model.find({
        $or: [{ firstName: { $regex: regex } },
              { lastName:  { $regex: regex } }],
      });
    };
    
// In src/Kambaz/server/Kambaz/Users/dao.js or equivalent
export async function findCoursesForUser(userId) {
  // Get all enrollments for the user
  const enrollments = await enrollmentsModel.find({ user: userId }).populate("course");
  
  // Extract and mark courses as enrolled
  const courses = enrollments.map(enrollment => {
    return {
      ...enrollment.course._doc,
      enrolled: true // Add enrolled flag
    };
  });
  
  return courses;
}