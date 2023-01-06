const express = require("express");
var cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2019-05-30T17:30:31.098Z",
        important: true,
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2019-05-30T18:39:34.091Z",
        important: false,
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2019-05-30T19:20:14.298Z",
        important: true,
    },
];
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (request, response) => {
    response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
    response.json(notes);
});

app.get("/api/notes/:id", (req, res) => {
    const { id } = req.params;

    const noteRes = notes.find((note) => note.id === Number(id));

    if (!noteRes) {
        return res.status(404).end();
    }
    res.json(noteRes);
});

app.delete("/api/notes/:id", (req, res) => {
    const { id } = req.params;

    notes = notes.filter((note) => note.id !== Number(id));

    console.log(notes);

    res.status(204).end();
});

app.post("/api/notes", (req, res) => {
    // const note = req.body;
    const { content, important, date } = req.body;

    if (!content) {
        return res.status(400).json({
            error: "content is empty",
        });
    }

    // console.log(req.get("Content-type"));
    const note = {
        content: content,
        date: date,
        important: important,
        id: uuidv4(),
    };

    notes = [...notes, note];

    // res.json({ ...note, status: 200 });
    res.json(notes.find((nt) => nt.id === note.id));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
