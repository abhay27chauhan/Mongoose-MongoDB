// express - a framework for building servers
// morgan = a middleware for logging incoming requests

// cast error - you gave it a different value type then what its expecting

const express = require('express')
const morgan = require('morgan')
const connect = require('../connect')

const app = express()
const Todo = require('./todo')

app.use(morgan('dev'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.get('/todo/:id', async (req, res) => {
  const todoId = req.params.id
  const todo = await Todo.findById(todoId).exec()
  res.status(200).json(todo)
})

app.get('/todos', async (req, res) => {
  const todos = await Todo.find({}).lean().exec() // lean() -> to object
  res.status(200).json(todos)
})

app.post('/todo', async (req, res) => {
  const todoToCreate = req.body.todo
  const todo = await Todo.create(todoToCreate) // cannot use lean() or exec() here becoz not a query
  res.status(201).json(todo.toJSON()) // .toJSON() -> it gives you back an object
})

connect('mongodb://localhost:27017/intro-to-mongodb')
  .then(() => app.listen(4000, () => {
    console.log('server on http://localhost:4000')
  }))
  .catch(e => console.error(e))
