import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
// let currentUser = null;
import * as enrollmentsDao from "../Enrollments/dao.js";
export default function UserRoutes(app) {
  const createUser = async (req, res) => {
    const newUser = await dao.createUser(req.body);
    res.json(newUser);
  };

  const deleteUser = async (req, res) => {
    const status = await
      dao.deleteUser(req.params.userId);
    res.json(status);

  };
  const findAllUsers = async (req, res) => {
    const { role, name  } = req.query;
    if (role) {
      const users = await dao.findUsersByRole(role);
      res.json(users);
      return;
    }
    if (name) {
      const users = await 
        dao.findUsersByPartialName(name);
      res.json(users);
      return;
    }

    const users = await dao.findAllUsers();
    res.json(users);
  };
  const findUserById = async (req, res) => {
    const user =
      await dao.findUserById(req.params.userId);
    res.json(user);

  };
  const updateUser = async (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;
    await dao.updateUser(userId, userUpdates);
    const currentUser = await dao.findUserById(userId);
    if (currentUser._id === userId) {
      req.session["currentUser"] = currentUser;
    }
    res.json(currentUser);
   
  };

  const signup = async (req, res) => {
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already in use" });
      return;
    }
    const currentUser = await dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };
  const signin = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };

  const signout = async (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };

  const profile = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };
  // In src/Kambaz/server/Kambaz/Users/routes.js
const findCoursesForUser = async (req, res) => {
  try {
    console.log("findCoursesForUser called with params:", req.params);
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      console.log("No current user in session");
      res.sendStatus(401);
      return;
    }
    
    console.log("Current user:", currentUser._id);
    
    if (currentUser.role === "ADMIN") {
      console.log("Admin user, returning all courses");
      const courses = await courseDao.findAllCourses();
      res.json(courses);
      return;
    }
    
    let { uid } = req.params;
    if (uid === "current") {
      uid = currentUser._id;
    }
    
    console.log("Finding courses for user:", uid);
    const courses = await enrollmentsDao.findCoursesForUser(uid);
    console.log(`Found ${courses.length} courses for user ${uid}`);
    
    res.json(courses);
  } catch (error) {
    console.error("Error in findCoursesForUser:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
  const enrollUserInCourse = async (req, res) => {
    try {
      let { uid, cid } = req.params;
      if (uid === "current") {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
          return res.status(401).json({ message: "Not authenticated" });
        }
        uid = currentUser._id;
      }
      
      // Check if already enrolled to avoid duplicate errors
      const existingEnrollment = await enrollmentsDao.findEnrollment(uid, cid);
      if (existingEnrollment) {
        return res.json(existingEnrollment);
      }
      
      const enrollment = await enrollmentsDao.enrollUserInCourse(uid, cid);
      res.json(enrollment);
    } catch (error) {
      res.status(500).json({ message: "Error enrolling user", error: error.message });
    }
  };
  const unenrollUserFromCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      uid = currentUser._id;
    }
    const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
    res.send(status);
  };
  
  // const findCoursesForEnrolledUser = async (req, res) => {
  //   let { userId } = req.params;
  //   if (userId === "current") {
  //     const currentUser = req.session["currentUser"];
  //     if (!currentUser) {
  //       res.sendStatus(401);
  //       return;
  //     }
  //     userId = currentUser._id;
  //   }
  //   const courses = await courseDao.findCoursesForEnrolledUser(userId);
  //   res.json(courses);
  // };
  const createCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    const newCourse = await courseDao.createCourse(req.body);
    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };
  app.post("/api/users/current/courses", createCourse);
  // app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  // src/Kambaz/server/Kambaz/Users/routes.js - Update these routes
app.get("/api/users/:uid/courses", findCoursesForUser);
app.post("/api/users/:uid/courses/:cid/enrollments", enrollUserInCourse);
app.delete("/api/users/:uid/courses/:cid/enrollments", unenrollUserFromCourse);
 
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
}
