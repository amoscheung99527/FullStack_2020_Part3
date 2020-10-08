const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

let persons =[
  {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
      id: 2,
      name: "Ada Lovelace",
      number: "39-44-5323523"
    },
    {
      id: 3,
      name: "Dan Abramov",
      number: "12-43-234345"
    },
    {
      id: 4,
      name: "Mary Poppendieck",
      number: "39-23-6423122"
    }
]

morgan.token('person', (req, res)=>{
  const {body} = req
  return JSON.stringify(body)
})

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
)

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${Math.max(...persons.map(n => n.id))} people</p><p>${Date()}</p>`)
})

app.get('/api/persons', (req, res) =>{
  res.send(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = persons.find(note => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.post('api/persons', (request, response)=>{
  const {body} = request

  if(!body.name||!body.number){
    return response.status(400).json({
      error: 'name/number does not exist'
    })
  }

  const person = new Person ({
    name: body.name,
    number: body.number,
  })

  person.save().then((savedPerson)=>{
    response.json(savedPerson.toJSON())
  })
  .catch((error)=> next(error))
})

app.put('api/persons/:id', (req, res, next) =>{
  const {body} = req
  const {id} = req.params

  const person={
    name:body.name,
    number: body.number,
  }

  Person.findbyIdAndUpdate(id, person, {new: true})
    .then ((updatedPerson) =>{
      res.json(updatedPerson.toJSON())
    })
    .catch((error)=> next(error))

})

app.delete('/api/persons/:id', (request,response)=>{
  const id = Number(request.params.id)
  persons = persons.filter(note=>note.id!=id)

  response.status(204).end
})

const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`)
})
