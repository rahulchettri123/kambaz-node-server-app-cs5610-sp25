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

// Important: CORS must be configured before session middleware
app.use(
  cors({
    credentials: true,
    // Accept all origins in production, or specify your Netlify domain
    origin: process.env.NODE_ENV === "development" 
      ? "http://localhost:5173" 
      : [
          "https://a6--charming-gecko-0c3626.netlify.app",
          "https://charming-gecko-0c3626.netlify.app"
        ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

// Add proper session configuration
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false, // Changed to false to avoid creating empty sessions
  cookie: {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
};

if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    ...sessionOptions.cookie,
    sameSite: "none",
    secure: true,
    // Remove domain setting as it can cause issues with cross-domain cookies
  };
}

app.use(session(sessionOptions));
app.use(express.json());

// Add middleware to debug session state
app.use((req, res, next) => {
  console.log("Session debug:", {
    sessionID: req.sessionID,
    hasCurrentUser: !!req.session.currentUser,
    cookies: req.headers.cookie
  });
  next();
});

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