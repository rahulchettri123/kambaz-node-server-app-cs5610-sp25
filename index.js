import express from "express"; // load express
// create instance
import "dotenv/config";
import cors from "cors";
import Lab5 from "./Lab5/index.js";
import Hello from "./hello.js"; // load hello.js
import session from "express-session";
import SessionController from "./Lab5/SessionController.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js"; // Make sure this path is correct
import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";

const app = express(); // Initialize Express app
import mongoose from "mongoose";

const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING ||"mongodb://127.0.0.1:27017/kambaz-cs5610-sp25";
mongoose.connect(CONNECTION_STRING);
app.use(
  cors({
    credentials: true,
    origin: process.env.NETLIFY_URL,
  })
);

const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {},
};

if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.NODE_SERVER_DOMAIN,
  };
}

app.use(session(sessionOptions));
app.use(express.json());

// Initialize routes
UserRoutes(app);
Hello(app);
CourseRoutes(app);
Lab5(app);
ModuleRoutes(app);
AssignmentRoutes(app); // Keep only one instance
SessionController(app);
EnrollmentRoutes(app);
// Removed duplicate AssignmentRoutes(app)
// Define the port
const PORT = process.env.PORT || 4000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});