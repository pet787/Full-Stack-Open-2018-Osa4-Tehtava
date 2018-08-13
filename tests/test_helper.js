const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    'title': 'Test blog',
    'author': 'Test bloger',
    'url': 'https://Test.blog.com',
    'likes': 1
  },
  {
    'title': 'Test blog 2',
    'author': 'Test bloger',
    'url': 'https://Test2.blog.com',
    'likes': 2
  },
  {
    'title': 'Test blog 3',
    'author': 'Test bloger',
    'url': 'https://Test3.blog.com',
    'likes': 3
  },
  {
    'title': 'Test blog 4',
    'author': 'Test bloger',
    'url': 'https://Test4.blog.com',
    'likes': 4
  },
  {
    'title': 'Test blog 5',
    'author': 'Test bloger',
    'url': 'https://Test5.blog.com',
    'likes': 5
  },
]

const initialUsers = [
  {
    username: 'UN1',
    name: 'N1',
    adult: true,
    passwordHash: '$2b$10$mUfve5kE1II6JZ3Ph2660.vXOebq.Mw/vYC5wyMfSyiEbQL1DuXNS',
  },
  {
    username: 'UN2',
    name: 'name2',
    adult: false,
    passwordHash: '$2b$10$mUfve5kE1II6JZ3Ph2660.vXOebq.Mw/vYC5wyMfSyiEbQL1DuXNS',
  }
]

const nonExistingId = async () => {
  const blog = new Blog()
  await blog.save()
  await blog.remove()
  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find( {} )
  return blogs.map( Blog.format )
}

const usersInDb = async () => {
  const users = await User.find( {} )
  return users.map( User.format )
}

module.exports = {
  initialBlogs, initialUsers, nonExistingId, blogsInDb, usersInDb
}