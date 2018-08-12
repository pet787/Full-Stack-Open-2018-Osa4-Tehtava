const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { initialBlogs, nonExistingId, blogsInDb } = require('./test_helper')


describe('API Tests', () => {

  beforeAll(async () => {
    await Blog.remove({})

    const blogObjects = initialBlogs.map(n => new Blog(n))
    await Promise.all(blogObjects.map(n => n.save()))
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are four blogs', async () => {
    const response = await api
      .get('/api/blogs')

    expect(response.body.length).toBe(5)
  })

  test('the first blog author is Test bloger', async () => {
    const response = await api
      .get('/api/blogs')

    expect(response.body[0].author).toBe('Test bloger')
  })

  afterAll(() => {
    server.close()
  })

})