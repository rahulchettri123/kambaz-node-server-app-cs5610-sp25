import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
  // Get all enrollments
  app.get("/api/enrollments", (req, res) => {
    const enrollments = dao.findAllEnrollments();
    res.json(enrollments);
  });

  // Get enrollments for a specific user
  app.get("/api/users/:uid/enrollments", (req, res) => {
    const { uid } = req.params;
    const enrollments = dao.findEnrollmentsForUser(uid);
    res.json(enrollments);
  });

  // Get enrollments for a specific course
  app.get("/api/courses/:cid/enrollments", (req, res) => {
    const { cid } = req.params;
    const enrollments = dao.findEnrollmentsForCourse(cid);
    res.json(enrollments);
  });

  // Check if user is enrolled in a course
  app.get("/api/users/:uid/courses/:cid/enrollment", (req, res) => {
    const { uid, cid } = req.params;
    const enrollment = dao.findEnrollment(uid, cid);
    if (enrollment) {
      res.json(enrollment);
    } else {
      res.status(404).json({ message: "Enrollment not found" });
    }
  });

  // Create enrollment (enroll user in course)
  app.post("/api/users/:uid/courses/:cid/enrollments", (req, res) => {
    const { uid, cid } = req.params;
    // Check if already enrolled
    const existingEnrollment = dao.findEnrollment(uid, cid);
    if (existingEnrollment) {
      return res.json(existingEnrollment);
    }
    const enrollment = dao.enrollUserInCourse(uid, cid);
    res.json(enrollment);
  });

  // Delete enrollment by ID
  app.delete("/api/enrollments/:eid", (req, res) => {
    const { eid } = req.params;
    const result = dao.unenrollUserFromCourse(eid);
    if (result.success) {
      res.json({ message: "User unenrolled successfully" });
    } else {
      res.status(404).json({ message: "Enrollment not found" });
    }
  });

  // Delete enrollment by user ID and course ID
  app.delete("/api/users/:uid/courses/:cid/enrollments", (req, res) => {
    const { uid, cid } = req.params;
    const result = dao.unenrollUserFromCourseByIds(uid, cid);
    if (result.success) {
      res.json({ message: "User unenrolled successfully" });
    } else {
      res.status(404).json({ message: "Enrollment not found" });
    }
  });
}