const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const { initialBlogs, initialUsers, blogsInDb, usersInDb } = require('./test_helper')

describe('/api Tests', async () => {

  describe.skip('/api/blogs Tests', async () => {

    beforeAll(async () => {
      await Blog.remove({})

      const blogObjects = initialBlogs.map(n => new Blog(n))
      await Promise.all(blogObjects.map(n => n.save()))
    })

    test('all blogs are returned as json by GET /api/blogs', async () => {
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
          title: 'Test blog X',
          author: 'Test bloger',
          url: 'https://TestX.blog.com',
          likes: 10
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

      describe('modifying of a blog', async () => {
        let originalBlog

        beforeAll(async () => {
          originalBlog = new Blog({
            title: 'TEST HTTP PUT',
            author: 'nobody',
            url: 'https://TestX.blog.com',
            likes: 1
          })
          await originalBlog.save()
        })

        test('PUT /api/blogs/:id succeeds with proper statuscode', async () => {

          const modifiedBlog = {
            title: 'Test blog X',
            author: 'Test bloger',
            url: 'https://TestX.blog.com',
            likes: 99
          }
          const response = await api
            .put(`/api/blogs/${originalBlog._id}`)
            .send(modifiedBlog)
            .expect(200)

          expect(response.body.likes).toBe(99)
        })
      })

    })

  })

  describe('/api/users Tests', async () => {

    beforeAll(async () => {
      await User.remove({})

      const userObjects = initialUsers.map(n => new User(n))
      await Promise.all(userObjects.map(n => n.save()))
    })

    test('all users are returned as json by GET /api/blogs', async () => {
      const usersInDatabase = await usersInDb()

      const response = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.length).toBe(usersInDatabase.length)

      const returnedUsernames = response.body.map(n => n.username)
      usersInDatabase.forEach(user => {
        expect(returnedUsernames).toContain(user.username)
      })
    })

    test('POST /api/users succeeds with a fresh username', async () => {
      const usersBeforeOperation = await usersInDb()

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen'
      }

      await api
        .post( '/api/users' )
        .send( newUser )
        .expect( 200 )
        .expect( 'Content-Type', /application\/json/ )

      const usersAfterOperation = await usersInDb()
      expect( usersAfterOperation.length ).toBe( usersBeforeOperation.length + 1 )
      const usernames = usersAfterOperation.map(u => u.username)
      expect( usernames ).toContain( newUser.username )
    })

    test('POST /api/users fails with proper statuscode and message if username already taken', async () => {
      const usersBeforeOperation = await usersInDb()

      const newUser = {
        username: 'UN1',
        name: 'failure',
        password: 'salainen'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body).toEqual({ error: 'username must be unique' })

      const usersAfterOperation = await usersInDb()
      expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
    })

  })


  afterAll(() => {
    server.close()
  })

})