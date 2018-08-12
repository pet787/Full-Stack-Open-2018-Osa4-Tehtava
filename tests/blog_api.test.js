const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { initialBlogs, nonExistingId, blogsInDb } = require('./test_helper')


describe('/api/blogs Tests', () => {

  beforeAll(async () => {
    await Blog.remove({})

    const blogObjects = initialBlogs.map(n => new Blog(n))
    await Promise.all(blogObjects.map(n => n.save()))
  })

  test('all blogss are returned as json by GET /api/blogs', async () => {
    const blogsInDatabase = await blogsInDb()

    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length).toBe(blogsInDatabase.length)

    const returnedTitles = response.body.map(n => n.title)
    blogsInDatabase.forEach(blog => {
      expect(returnedTitles).toContain(blog.title)
    })
  })

  describe('addition of a new blog', async () => {

    test('POST /api/blogs succeeds with valid data', async () => {
      const blogsBefore = await blogsInDb()

      const newBlog = {
        'title': 'Test blog X',
        'author': 'Test bloger',
        'url': 'https://TestX.blog.com',
        'likes': 10
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAfter = await blogsInDb()

      expect(blogsAfter.length).toBe(blogsBefore.length + 1)

      const titles = blogsAfter.map(r => r.title)
      expect(titles).toContain('Test blog X')
    })

    test('POST /api/blogs fails with proper statuscode if title is missing', async () => {
      const newBlog = {
        url: 'https://Test4.blog.com',
        author: 'Test bloger',
        likes: 0
      }

      const blogsBefore = await blogsInDb()

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAfter = await blogsInDb()

      expect(blogsAfter.length).toBe(blogsBefore.length)
    })

    test('POST /api/blogs fails with proper statuscode if url is missing', async () => {
      const newBlog = {
        title: 'By failing to prepare, you are preparing to fail',
        author: 'Test bloger',
        likes: 0
      }

      const blogsBefore = await blogsInDb()

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAfter = await blogsInDb()

      expect(blogsAfter.length).toBe(blogsBefore.length)
    })

    test('POST /api/blogs with likes is undefined to be made 0', async () => {
      const newBlog = {
        title: 'Test blog X',
        author: 'Test bloger',
        url: 'https://TestX.blog.com',
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.likes).toBe(0)
    })

    describe('deletion of a blog', async () => {
      let addedBlog

      beforeAll(async () => {
        addedBlog = new Blog({
          title: 'TEST HTTP DELETE',
          author: 'nobody',
          url: 'https://TestX.blog.com'
        })
        await addedBlog.save()
      })

      test('DELETE /api/blogs/:id succeeds with proper statuscode', async () => {
        const blogsBefore = await blogsInDb()

        await api
          .delete(`/api/blogs/${addedBlog._id}`)
          .expect(204)

        const blogsAfter = await blogsInDb()

        const titles = blogsAfter.map(r => r.title)

        expect(titles).not.toContain(addedBlog.title)
        expect(blogsAfter.length).toBe(blogsBefore.length - 1)
      })
    })

  })

  afterAll(() => {
    server.close()
  })

})