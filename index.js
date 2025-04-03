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
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";
const app = express(); // Initialize Express app

app.use(cors({
  credentials: true,
  origin: process.env.NETLIFY_URL,
}));

const sessionOptions = {
  secret: process.env.SESSION_SECRET ,
  resave: false,
  saveUninitialized: true,
  cookie: {}
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
AssignmentRoutes(app);
SessionController(app);
EnrollmentRoutes(app);
// Remove duplicate route initialization


app.listen(process.env.PORT || 4000, () => {
  console.log(`Server running on port ${process.env.PORT || 4000}`);
});