const Blog = require('../models/blog')

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

const nonExistingId = async () => {
  const blog = new Blog()
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const notes = await Blog.find( {} )
  return notes.map( Blog.format )
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}