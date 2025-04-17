import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
import * as usersDao from "../Users/dao.js";

export default function CourseRoutes(app) {
  // Middleware to check if user is faculty or admin
  const isFacultyOrAdmin = (req, res, next) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    if (currentUser.role !== "FACULTY" && currentUser.role !== "ADMIN") {
      return res.status(403).json({ message: "Not authorized. Faculty or Admin role required." });
    }
    
    next();
  };

  // Get all users enrolled in a course
  app.get("/api/courses/:cid/users", async (req, res) => {
    try {
      const { cid } = req.params;
      const users = await enrollmentsDao.findUsersForCourse(cid);
      
      // Return empty array if no users found (instead of null/undefined)
      res.json(users || []);
    } catch (error) {
      console.error(`Error fetching users for course ${cid}:`, error);
      // Return empty array instead of error to make client handling simpler
      res.json([]);
    }
  });

  // Enroll a user in a course - faculty/admin only
  app.post("/api/courses/:cid/users/:uid", isFacultyOrAdmin, async (req, res) => {
    try {
      const { cid, uid } = req.params;
      const result = await enrollmentsDao.enrollUserInCourse(uid, cid);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Error enrolling user in course", error: error.message });
    }
  });

  // Remove a user from a course - faculty/admin only
  app.delete("/api/courses/:cid/users/:uid", isFacultyOrAdmin, async (req, res) => {
    try {
      const { cid, uid } = req.params;
      const result = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Error removing user from course", error: error.message });
    }
  });

  // Update a user's role within a course - faculty/admin only
  app.put("/api/courses/:cid/users/:uid", isFacultyOrAdmin, async (req, res) => {
    try {
      const { cid, uid } = req.params;
      const updates = req.body;
      
      // First update the user
      await usersDao.updateUser(uid, updates);
      
      // Then return the updated user
      const updatedUser = await usersDao.findUserById(uid);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Error updating user in course", error: error.message });
    }
  });

 // For retrieving all courses
app.get("/api/courses", async (req, res) => {
  try {
      const courses = await dao.findAllCourses();
      res.json(courses);
  } catch (error) {
      res.status(500).json({ message: "Error fetching courses", error: error.message });
  }
});

  // Delete course - faculty/admin only
  app.delete("/api/courses/:courseId", isFacultyOrAdmin, async (req, res) => {
    try {
      const { courseId } = req.params;
      const status = await dao.deleteCourse(courseId);
      res.send(status);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  
  // Update course - faculty/admin only
  app.put("/api/courses/:courseId", isFacultyOrAdmin, async (req, res) => {
    try {
      const { courseId } = req.params;
      const courseUpdates = req.body;
      const status = await dao.updateCourse(courseId, courseUpdates);
      res.send(status);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });


  // Create module for course - faculty/admin only
  app.post("/api/courses/:courseId/modules", isFacultyOrAdmin, async (req, res) => {
    try {
      const { courseId } = req.params;
      const module = {
        ...req.body,
        course: courseId,
      };
      const newModule = await modulesDao.createModule(module);
      res.send(newModule);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

  app.get("/api/courses/:courseId/modules", async (req, res) => {
    const { courseId } = req.params;
    const modules = await modulesDao.findModulesForCourse(courseId);
    res.json(modules);
  });
}
