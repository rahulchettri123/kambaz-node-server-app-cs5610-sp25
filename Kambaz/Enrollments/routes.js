import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
export default function EnrollmentRoutes(app) {
  // Get all enrollments
  app.get("/api/enrollments", async (req, res) => {
    try {
      const enrollments = await dao.findAllEnrollments();
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

  // Get enrollments for a specific user
  app.get("/api/users/:uid/enrollments", async (req, res) => {
    try {
      const { uid } = req.params;
      const enrollments = await dao.findEnrollmentsForUser(uid);
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

  // Get enrollments for a specific course
  app.get("/api/courses/:cid/enrollments", async (req, res) => {
    try {
      const { cid } = req.params;
      const enrollments = await dao.findEnrollmentsForCourse(cid);
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

  // Check if user is enrolled in a course
  app.get("/api/users/:uid/courses/:cid/enrollment", async (req, res) => {
    try {
      const { uid, cid } = req.params;
      const enrollment = await dao.findEnrollment(uid, cid);
      if (enrollment) {
        res.json(enrollment);
      } else {
        res.status(404).json({ message: "Enrollment not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

  // Create enrollment (enroll user in course)
 // Create enrollment (enroll user in course)
app.post("/api/users/:uid/courses/:cid/enrollments", async (req, res) => {
  try {
    const { uid, cid } = req.params;
    // Check if already enrolled
    const existingEnrollment = await dao.findEnrollment(uid, cid);
    if (existingEnrollment) {
      return res.json(existingEnrollment);
    }
    const enrollment = await dao.enrollUserInCourse(uid, cid);
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: "Error enrolling user", error: error.message });
  }
});

  // Delete enrollment by ID
  app.delete("/api/enrollments/:eid", async (req, res) => {
    try {
      const { eid } = req.params;
      const result = await dao.unenrollUserFromCourse(eid);
      if (result.success) {
        res.json({ message: "User unenrolled successfully" });
      } else {
        res.status(404).json({ message: "Enrollment not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

  // Delete enrollment by user ID and course ID
  app.delete("/api/users/:uid/courses/:cid/enrollments", async (req, res) => {
    try {
      const { uid, cid } = req.params;
      const result = await dao.unenrollUserFromCourseByIds(uid, cid);
      if (result.success) {
        res.json({ message: "User unenrolled successfully" });
      } else {
        res.status(404).json({ message: "Enrollment not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  
  // Update enrollment status
  app.put("/api/enrollments/:eid/status", async (req, res) => {
    try {
      const { eid } = req.params;
      const { status } = req.body;
      const result = await dao.updateEnrollmentStatus(eid, status);
      if (result.success) {
        res.json({ message: "Enrollment status updated successfully" });
      } else {
        res.status(404).json({ message: "Enrollment not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  
  // Update enrollment grade
  app.put("/api/enrollments/:eid/grade", async (req, res) => {
    try {
      const { eid } = req.params;
      const { grade, letterGrade } = req.body;
      const result = await dao.updateEnrollmentGrade(eid, grade, letterGrade);
      if (result.success) {
        res.json({ message: "Enrollment grade updated successfully" });
      } else {
        res.status(404).json({ message: "Enrollment not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

 // Get courses for a specific user
app.get("/api/users/:uid/courses", async (req, res) => {
  try {
    const { uid } = req.params;
    
    // If uid is 'current' but we don't use session, use a fallback or error
    if (uid === "current") {
      return res.status(400).json({ message: "User ID required" });
    }
    
    const courses = await dao.findCoursesForUser(uid);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// Get users enrolled in a specific course
app.get("/api/courses/:cid/users", async (req, res) => {
  try {
    const { cid } = req.params;
    const users = await dao.findUsersForCourse(cid);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
}
