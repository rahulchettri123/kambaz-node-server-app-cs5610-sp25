import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
  // Get all assignments
  app.get("/api/assignments", (req, res) => {
    const assignments = dao.findAllAssignments();
    res.json(assignments);
  });

  // Get assignments for a course
  app.get("/api/courses/:cid/assignments", (req, res) => {
    const { cid } = req.params;
    const assignments = dao.findAssignmentsForCourse(cid);
    res.json(assignments);
  });

  // Get single assignment
  app.get("/api/assignments/:aid", (req, res) => {
    const { aid } = req.params;
    const assignment = dao.findAssignmentById(aid);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.json(assignment);
  });

  // Create assignment
  app.post("/api/assignments", (req, res) => {
    const assignment = dao.createAssignment(req.body);
    res.json(assignment);
  });

  // Update assignment
  app.put("/api/assignments/:aid", (req, res) => {
    const { aid } = req.params;
    const status = dao.updateAssignment(aid, req.body);
    if (status.acknowledged && status.modifiedCount === 1) {
      const assignment = dao.findAssignmentById(aid);
      res.json(assignment);
    } else {
      res.status(404).json({ message: "Assignment not found or not updated" });
    }
  });

  // Delete assignment
  app.delete("/api/assignments/:aid", (req, res) => {
    const { aid } = req.params;
    const status = dao.deleteAssignment(aid);
    if (status.acknowledged && status.deletedCount === 1) {
      res.json({ message: "Assignment deleted successfully" });
    } else {
      res.status(404).json({ message: "Assignment not found" });
    }
  });
}