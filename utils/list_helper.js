const sumLikes = ( a, blog ) => {
  return blog.likes + a
}

const maxLikes = ( highBlog, nextBlog ) => {
  if ( nextBlog.likes > highBlog.likes ) {
    return nextBlog
  }
  return highBlog
}

const totalLikes = (blogs) => {
  return blogs.reduce( sumLikes, 0 )
}

const favoriteBlog = (blogs) => {
  if (blogs === null || blogs.length === 0) {
    return null
  }

  const bestBlog = blogs.reduce( maxLikes )
  if (bestBlog) {
    console.log('return object', bestBlog )
    const result =  {
      title: bestBlog.title,
      author: bestBlog.author,
      likes: bestBlog.likes
    }
    console.log('bestBlog result',result)
    return result
  }
}

module.exports = {
  totalLikes, favoriteBlog
}