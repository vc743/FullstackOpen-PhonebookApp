const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

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

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
}

app.use(express.static('dist'));
app.use(cors());
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(requestLogger);

app.get('/', (request, response) => {
  response.send("<h1>Hello world</h1>")
})

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const date = new Date().toString();

  response.send(`<p>Phonebook has info for ${persons.length} ${
    persons.length === 1 ? "person" : "people"
  }</p>
                   <p>${date}</p>`);
});

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);

    if(person){
        response.json(person);
    } else{
        response.status(404).end()
    }
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
})

const generateId = () => {
  return Math.floor(Math.random() * 100000) + 1
}

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const nameExist = persons.find(person => person.name === body.name);

  if(!body.name || !body.number || nameExist){
    return response.status(400).json({
      error: "name must be unique"
    })
  }
  
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person);

  response.json(person);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
