import { Hono } from 'hono'
import { serve } from 'hono/bun'

const app = new Hono()

app.get('/', (c) => {
  return c.json({ message: 'Hello from Hono + Kilat!', version: '4.0.0' })
})

app.get('/api/time', (c) => {
  return c.json({ time: new Date().toISOString() })
})

app.get('/api/user/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ user: id, name: 'User ' + id })
})

serve({
  fetch: app.fetch,
  port: 3000,
})

console.log('Hono server running on http://localhost:3000')
