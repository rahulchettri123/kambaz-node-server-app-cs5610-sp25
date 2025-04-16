import * as modulesDao from "./dao.js";
export default function ModuleRoutes(app) {
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
  
  // Update module - requires faculty/admin role
  app.put("/api/modules/:moduleId", isFacultyOrAdmin, async (req, res) => {
    try {
      const { moduleId } = req.params;
      const moduleUpdates = req.body;
      const status = await modulesDao.updateModule(moduleId, moduleUpdates);
      res.send(status);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
 
  // Delete module - requires faculty/admin role
  app.delete("/api/modules/:moduleId", isFacultyOrAdmin, async (req, res) => {
    try {
      const { moduleId } = req.params;
      const status = await modulesDao.deleteModule(moduleId);
      res.send(status);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  
  // Add a lesson to a module - requires faculty/admin role
  app.post("/api/modules/:moduleId/lessons", isFacultyOrAdmin, async (req, res) => {
    try {
      const { moduleId } = req.params;
      const lesson = req.body;
      
      // Add the lesson to the module
      const result = await modulesDao.addLessonToModule(moduleId, lesson);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  
  // Get a module by ID
  app.get("/api/modules/:moduleId", async (req, res) => {
    try {
      const { moduleId } = req.params;
      const module = await modulesDao.findModuleById(moduleId);
      
      if (module) {
        res.json(module);
      } else {
        res.status(404).json({ message: "Module not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
}
