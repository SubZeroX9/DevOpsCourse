const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const NOTES_FILE = path.join(__dirname, 'notes.json');

app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync(NOTES_FILE, 'utf-8'));
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync(NOTES_FILE, 'utf-8'));
    const newNote = { id: Date.now(), text: req.body.text };
    notes.push(newNote);
    fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2));
    res.status(201).json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
    const notes = JSON.parse(fs.readFileSync(NOTES_FILE, 'utf-8'));
    const noteId = parseInt(req.params.id);
    const filteredNotes = notes.filter(note => note.id !== noteId);
    fs.writeFileSync(NOTES_FILE, JSON.stringify(filteredNotes, null, 2));
    res.json({ message: 'Note deleted successfully' });
})

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000'  
}));
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));