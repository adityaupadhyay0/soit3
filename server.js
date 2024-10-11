const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const sqlite3 = require('sqlite3').verbose(); // SQLite module

const app = express();
const port = 3000;

// Initialize database connection
const db = new sqlite3.Database('editorContent.db', (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    // Create table if it doesn't exist
    db.run(
      'CREATE TABLE IF NOT EXISTS content (id INTEGER PRIMARY KEY, boxes TEXT)',
      (err) => {
        if (err) {
          console.error('Error creating table:', err.message);
        } else {
          console.log('Table "content" is ready.');
        }
      }
    );
  }
});

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// Serve index.html on the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route to get saved content
app.get("/content", (req, res) => {
  console.log('GET /content request received'); // Log incoming request
  db.get('SELECT boxes FROM content WHERE id = 1', (err, row) => {
    if (err) {
      console.error('Error fetching content from the database:', err.message);
      res.status(500).json({ message: 'Error fetching content' });
    } else {
      console.log('Fetched content:', row ? row.boxes : 'No content found');
      const content = row ? JSON.parse(row.boxes) : [];
      res.json({ content });
    }
  });
});

// Route to save editor content
app.post("/content", (req, res) => {
  console.log('POST /content request received'); // Log incoming request
  console.log('Request body:', req.body); // Log the request body

  const { boxes } = req.body;
  if (!boxes) {
    console.error('No boxes provided in the request body');
    return res.status(400).json({ message: 'No boxes provided' });
  }

  const boxesString = JSON.stringify(boxes);
  console.log('Saving content:', boxesString); // Debug log

  db.run(
    `INSERT OR REPLACE INTO content (id, boxes) VALUES (1, ?)`,
    [boxesString],
    (err) => {
      if (err) {
        console.error('Error saving content to the database:', err.message);
        res.status(500).json({ message: 'Error saving content' });
      } else {
        console.log('Content saved successfully to the database.');
        res.json({ message: 'Content saved successfully' });
      }
    }
  );
});

// Dummy user authentication
const USERNAME = "user";
const PASSWORD = "password";

app.post("/login", (req, res) => {
  console.log('POST /login request received'); // Log incoming request
  const { username, password } = req.body;

  // Check the credentials (replace with proper authentication in production)
  if (username === USERNAME && password === PASSWORD) {
    console.log('Login successful for user:', username);
    res.json({ message: "Login successful", success: true });
  } else {
    console.error('Login failed for user:', username);
    res.status(401).json({ message: "Invalid username or password", success: false });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
