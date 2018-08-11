const totalLikes = (blogs) => {

  const sumLikes = ( a, blog ) => {
    return blog.likes + a
  }

  return blogs.reduce( sumLikes, 0 )
}

const favoriteBlog = (blogs) => {

  if (blogs === null || blogs.length === 0) {
    return null
  }

  const maxLikes = ( highBlog, nextBlog ) => {
    if ( nextBlog.likes > highBlog.likes ) {
      return nextBlog
    }
    return highBlog
  }

  const bestBlog = blogs.reduce( maxLikes )
  return  {
    title: bestBlog.title,
    author: bestBlog.author,
    likes: bestBlog.likes
  }
}

const mostBlogs = (blogs) => {

  if (blogs === null || blogs.length === 0) {
    return null
  }

  const matchAuthor = (author) => (blog) => {
    const result = blog.author === author
    return result
  }

  const creditAuthor = (author) => (blog) => {
    if (author === blog.author ) {
      return {
        author: author,
        blogs: blog.blogs + 1

      }
    } else {
      return blog
    }
  }

  const selectAuthors = ( authorList, nextBlog ) => {
    const author = nextBlog.author
    const authorFound = authorList.find( matchAuthor( author ) )
    if ( authorFound === undefined ) {
      return authorList.concat(
        {
          author: author,
          blogs: 1
        }
      )
    } else {
      return authorList.map( creditAuthor( authorFound.author ) )
    }
  }

  const maxBlogs = ( highBlog, nextBlog ) => {
    if ( nextBlog.blogs > highBlog.blogs ) {
      return nextBlog
    } else {
      return highBlog
    }
  }

  const authors = blogs.reduce( selectAuthors, [] )
  const bestAuthor = authors.reduce( maxBlogs )
  console.log(authors)
  return bestAuthor
}

module.exports = {
  totalLikes, favoriteBlog, mostBlogs
}