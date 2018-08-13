const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const { initialBlogs, initialUsers, blogsInDb, usersInDb } = require('./test_helper')

describe('/api Tests', async () => {

  describe('/api/blogs Tests', async () => {

    beforeAll(async () => {
      await Blog.remove({})

      const blogObjects = initialBlogs.map(n => new Blog(n))
      await Promise.all(blogObjects.map(n => n.save()))
    })

    describe('all blogs', async () => {

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

    })

    describe('blogs management', async () => {

      let token

      test('POST /api/login', async () => {
        const login = {
          username: 'UN1',
          password: 'PW1'
        }

        const response = await api
          .post('/api/login')
          .send(login)
          .expect(200)
          .expect('Content-Type', /application\/json/)

        token = response.body.token
      })

      test('POST /api/blogs succeeds with valid data', async () => {
        const blogsBefore = await blogsInDb()

        const newBlog = {
          title: 'POST /api/blogs succeeds with valid data',
          author: 'Test bloger',
          url: 'https://TestX.blog.com',
          likes: 10
        }

        await api
          .post('/api/blogs')
          .set( 'Authorization', 'bearer ' + token )
          .send(newBlog)
          .expect(200)
          .expect('Content-Type', /application\/json/)

        const blogsAfter = await blogsInDb()

        expect(blogsAfter.length).toBe(blogsBefore.length + 1)

        const titles = blogsAfter.map(r => r.title)
        expect(titles).toContain('POST /api/blogs succeeds with valid data')
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
          .set( 'Authorization', 'bearer ' + token )
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
          .set( 'Authorization', 'bearer ' + token )
          .send(newBlog)
          .expect(400)

        const blogsAfter = await blogsInDb()

        expect(blogsAfter.length).toBe(blogsBefore.length)
      })

      test('POST /api/blogs with likes is undefined to be made 0', async () => {
        const newBlog = {
          title: 'POST /api/blogs with likes is undefined to be made 0',
          author: 'Test bloger',
          url: 'https://TestX.blog.com',
        }

        const response = await api
          .post('/api/blogs')
          .set( 'Authorization', 'bearer ' + token )
          .send(newBlog)
          .expect(200)
          .expect('Content-Type', /application\/json/)

        expect(response.body.likes).toBe(0)
      })

      let addedBlog

      beforeAll(async () => {
        addedBlog = new Blog({
          title: 'TEST HTTP DELETE',
          author: 'nobody',
          url: 'https://TestX.blog.com'
        })
        await addedBlog
          .set( 'Authorization', 'bearer ' + token )
          .save()
      })

      test('DELETE /api/blogs/:id succeeds with proper statuscode', async () => {
        const blogsBefore = await blogsInDb()

        await api
          .delete(`/api/blogs/${addedBlog._id}`)
          .set( 'Authorization', 'bearer ' + token )
          .expect(204)

        const blogsAfter = await blogsInDb()

        const titles = blogsAfter.map(r => r.title)

        expect(titles).not.toContain(addedBlog.title)
        expect(blogsAfter.length).toBe(blogsBefore.length - 1)
      })

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
          title: 'Modifying of a blog',
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

  describe('/api/users Tests', async () => {

    beforeAll(async () => {
      await User.remove({})

      const userObjects = initialUsers.map(n => new User(n))
      await Promise.all(userObjects.map(n => n.save()))
    })

    test('all users are returned as json by GET /api/users', async () => {
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

    test('POST /api/users succeeds with a fresh username and adult is set true by default', async () => {
      const usersBeforeOperation = await usersInDb()

      const findNewUser = (username) => (user) => {
        return username === user.username
      }

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
      const createdUser = usersAfterOperation.find(findNewUser(newUser.username))
      expect( createdUser.adult ).toBe(true)
      const usernames = usersAfterOperation.map(u => u.username)
      expect( usersAfterOperation.length ).toBe( usersBeforeOperation.length + 1 )
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

      const usersAfterOperation = await usersInDb()
      expect(result.body).toEqual({ error: 'username must be unique' })
      expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
    })

    test('POST /api/users fails with proper statuscode and message if password to short', async () => {
      const usersBeforeOperation = await usersInDb()

      const newUser = {
        username: 'passwordtooshort',
        name: 'failure',
        password: 'sa'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAfterOperation = await usersInDb()
      expect(result.body).toEqual({ error: 'passwords minimum length is 3' })
      expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
    })

  })

  afterAll(() => {
    server.close()
  })

})