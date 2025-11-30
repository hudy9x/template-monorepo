import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getAllTests, createTest } from '@local/database'

const app = new Hono()

// Enable CORS for web app
app.use('/*', cors({
  origin: 'http://localhost:3000',
  credentials: true,
}))

app.get('/', (c) => {
  return c.text('Hello Hono 2!')
})

// Get all tests
app.get('/tests', async (c) => {
  try {
    const tests = await getAllTests()
    return c.json(tests)
  } catch (error) {
    console.log('error', error)
    return c.json({ error: 'Failed to fetch tests' }, 500)
  }
})

// Create a new test
app.post('/tests', async (c) => {
  try {
    const body = await c.req.json()
    const test = await createTest(body.name, body.description)
    return c.json(test, 201)
  } catch (error) {
    return c.json({ error: 'Failed to create test' }, 500)
  }
})

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT) || 4001
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
