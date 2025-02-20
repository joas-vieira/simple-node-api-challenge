import { randomUUID } from 'node:crypto'
import { Database } from "./database.js"
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'POST',
    url: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if (!title) {
        return res.writeHead(400).end(
          JSON.stringify({ message: 'título é obrigatório' })
        )
      }

      if (!description) {
        return res.writeHead(400).end(
          JSON.stringify({message: 'descrição é obrigatória'})
        )
      }
      
      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      }
  
      database.insert('tasks', task)
  
      return res.writeHead(201).end()
    }
  },
  {
    method: 'GET',
    url: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? { title: search, description: search } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'PUT',
    url: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      if (!title && !description) {
        return res.writeHead(400).end(
          JSON.stringify({ message: 'título ou descrição são obrigatórios' })
        )
      }

      const [task] = database.select('tasks', { id })

      if (!task) return res.writeHead(404).end()

      database.update('tasks', id, {
        title: title ?? task.title,
        description: description ?? task.description,
        updated_at: new Date(),
      })

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    url: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const [task] = database.select('tasks', { id })

      if (!task) return res.writeHead(404).end()
      
      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    url: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const [task] = database.select('tasks', { id })

      if (!task) return res.writeHead(404).end()

      database.update('tasks', id, {
        completed_at: task.completed_at ? null : new Date()
      })

      return res.writeHead(204).end()
    }
  }
]