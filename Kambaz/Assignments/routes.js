// src/Kambaz/server/Kambaz/Assignments/routes.js
import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
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

  // Get all assignments - accessible to all authenticated users
  app.get("/api/assignments", async (req, res) => {
    try {
      const assignments = await dao.findAllAssignments();
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

  // Get assignment by ID - accessible to all authenticated users
  app.get("/api/assignments/:aid", async (req, res) => {
    try {
      const { aid } = req.params;
      const assignment = await dao.findAssignmentById(aid);
      if (assignment) {
        res.json(assignment);
      } else {
        res.status(404).json({ message: "Assignment not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

  // Get assignments for a course - accessible to all authenticated users
  app.get("/api/courses/:cid/assignments", async (req, res) => {
    try {
      const { cid } = req.params;
      const assignments = await dao.findAssignmentsForCourse(cid);
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

  // Create a new assignment - faculty/admin only
  app.post("/api/assignments", isFacultyOrAdmin, async (req, res) => {
    try {
      const assignment = req.body;
      const newAssignment = await dao.createAssignment(assignment);
      res.json(newAssignment);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

  // Update an assignment - faculty/admin only
  app.put("/api/assignments/:aid", isFacultyOrAdmin, async (req, res) => {
    try {
      const { aid } = req.params;
      const updates = req.body;
      const status = await dao.updateAssignment(aid, updates);
      if (status.modifiedCount === 1) {
        const updatedAssignment = await dao.findAssignmentById(aid);
        res.json(updatedAssignment);
      } else {
        res.status(404).json({ message: "Assignment not found or not modified" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

  // Delete an assignment - faculty/admin only
  app.delete("/api/assignments/:aid", isFacultyOrAdmin, async (req, res) => {
    try {
      const { aid } = req.params;
      const status = await dao.deleteAssignment(aid);
      if (status.deletedCount === 1) {
        res.json({ message: "Assignment deleted successfully" });
      } else {
        res.status(404).json({ message: "Assignment not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
}