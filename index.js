let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const express = require("express");
const app = express();
var morgan = require("morgan");

app.use(express.json());

// Define a custom token for logging request bodies
morgan.token("req-body", (req) => {
  // This will convert the request body to a JSON string for logging
  // You might want to do this conditionally based on the route or request type
  return JSON.stringify(req.body);
});

// Use Morgan with the 'tiny' format and also log the custom 'req-body' token
// The format string components for 'tiny' are ':method :url :status :res[content-length] - :response-time ms'
// We're adding ' :req-body' at the end to log the request body as well
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body"
  )
);
const generateId = () => {
  return Math.floor(Math.random() * 1000000000);
};

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/info", (request, response) => {
  const htmlResponse = `<div>Phonebook has info for ${
    persons.length
  } people</div><br/><div>${new Date()}</div>`;
  response.send(htmlResponse);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => {
    console.log(person.id, typeof person.id, id, typeof id, person.id === id);
    return person.id === id;
  });

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name or number missing. Please specify both!",
    });
  }

  if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({
      error: "This name already exists in the Phonebook. Please add a new one!",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
