// Load environment variables
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const basicRoutes = require("./routes/index");
const { connectDB } = require("./config/database");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;
// Pretty-print JSON responses
app.enable('json spaces');
// We want to be consistent with URL paths, so we enable strict routing
app.enable('strict routing');

app.use(cors({}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection - only try to connect if DATABASE_URL is provided
let isDbConnected = false;
if (process.env.DATABASE_URL) {
  console.log("Attempting to connect to MongoDB...");
  connectDB()
    .then(() => {
      isDbConnected = true;
      console.log("MongoDB connected and ready to use");
    })
    .catch(err => {
      console.error("MongoDB connection failed, running without database:", err.message);
      console.log("API endpoints will be available but data won't be persisted.");
      // Continue application execution even if MongoDB connection fails
    });
} else {
  console.log("No DATABASE_URL provided, running without database connection.");
  console.log("API endpoints will be available but data won't be persisted.");
}

// Make DB connection status available to the app
app.locals.isDbConnected = isDbConnected;

app.on("error", (error) => {
  console.error(`Server error: ${error.message}`);
  console.error(error.stack);
});

// Basic Routes
app.use(basicRoutes);

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  res.status(404).send("Page not found.");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`Unhandled application error: ${err.message}`);
  console.error(err.stack);
  res.status(500).send("There was an error serving your request.");
});

// Check Python dependencies
console.log('Checking Python modules for GNN-FakeNews...');
const { isPythonModuleAvailable } = require('./services/pythonBridgeService');

Promise.all([
  isPythonModuleAvailable('numpy'),
  isPythonModuleAvailable('torch'),
  isPythonModuleAvailable('transformers')
])
.then(([hasNumpy, hasTorch, hasTransformers]) => {
  if (hasNumpy && hasTorch && hasTransformers) {
    console.log('Required Python modules are available for GNN-FakeNews analysis');
  } else {
    console.log('Some required Python modules are missing');
    console.log(`numpy: ${hasNumpy ? 'Available' : 'Missing'}`);
    console.log(`torch: ${hasTorch ? 'Available' : 'Missing'}`);
    console.log(`transformers: ${hasTransformers ? 'Available' : 'Missing'}`);
    console.log('Fake news analysis will use mock implementation');
  }
});

// Only start the server once all setup is complete
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Database ${isDbConnected ? 'is connected' : 'connection failed, using in-memory storage'}`);
});