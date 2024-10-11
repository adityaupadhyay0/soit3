const USERNAME = 'user';
const PASSWORD = 'password';


const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;
const contentFile = 'editorContent.json';

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files



// Route to get the saved content
app.get('/content', (req, res) => {
    if (fs.existsSync(contentFile)) {
        const content = fs.readFileSync(contentFile, 'utf-8');
        res.json({ content: JSON.parse(content) });
    } else {
        res.json({ content: '' });
    }
});

// Route to save the editor content
app.post('/content', (req, res) => {
    const { content } = req.body;
    fs.writeFileSync(contentFile, JSON.stringify(content, null, 2));
    res.json({ message: 'Content saved successfully' });
});
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check the credentials (replace with proper authentication in production)
    if (username === USERNAME && password === PASSWORD) {
        res.json({ message: 'Login successful', success: true });
    } else {
        res.status(401).json({ message: 'Invalid username or password', success: false });
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
