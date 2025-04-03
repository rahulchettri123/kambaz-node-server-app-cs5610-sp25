import PathParameters from "./PathParameters.js";
import QueryParameters from "./QueryParameters.js";
import SessionController from "./SessionController.js";
import WorkingWithArrays from "./WorkingWithArrays.js";
import WorkingWithObjects from "./WorkingWithObjects.js";

export default function Lab5(app) {
    app.get("/Lab5/welcome", (req, res) => {
      res.send("Welcome to Assignment 5");
    });
    PathParameters(app);
    QueryParameters(app);
    WorkingWithObjects(app);
    WorkingWithArrays(app);
    SessionController(app);
  }
 