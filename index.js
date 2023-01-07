const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 3000;

// tambien podemos crear nuestro propio middleware

morgan.token("body", function (req, res) {
    if (req.method === "POST") {
        return JSON.stringify(req.body);
    }
});

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
app.use(morgan(":method -- :url -- :status -- :response-time ms :body"));
// haciendo una modificacion

let persons = [
    { id: 1, name: "cristian", number: 234234 },
    { id: 2, name: "elvis", number: 565656 },
    { id: 3, name: "juan", number: 787878 },
];

function createId() {
    return persons.map((person) => person.id).length + 1;
}

const date = new Date();

// app.get("/", function (req, res) {
//     res.send("<h2>Hi, this is my first app node</h2>");
// });

app.get("/info", (req, res) => {
    res.send(`<div>
        <h2>phonebooks has info for ${persons.length} people</h2>
        <p>${date}</p>
    </div>`);
});

app.get("/api/persons", function (req, res) {
    console.log(req.method);
    res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
    const { id } = req.params;
    const person = persons.find((person) => person.id === Number(id));

    if (!person) {
        return res.status(404).json({
            message: "person not found",
        });
    }

    res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
    const { id } = req.params;

    const person = persons.find((person) => person.id === Number(id));
    if (!person) {
        return res.status(404).json({
            message: "person not found",
        });
    }

    persons = persons.filter((person) => person.id !== Number(id));

    res.status(204).end();
});

app.post("/api/persons", (req, res) => {
    const { name, number } = req.body;

    if (!name || !number) {
        return res.status(400).json({ message: "fill in the fields" });
    }

    const personExisting = persons.find((person) => person.name === name);
    if (personExisting) {
        return res.status(400).json({ message: "person existing" });
    }

    const newPerson = {
        id: createId(),
        name: name,
        number: number,
    };

    persons = [...persons, newPerson];

    res.json({ ...newPerson });
});

// middleware para las rutas que no exiten
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

app.listen(PORT, () => {
    console.log("server on port", PORT);
});
