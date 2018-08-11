const sumLikes = ( a, blog ) => {
  return blog.likes + a
}

const totalLikes = (blogs) => {
  const result = blogs.reduce( sumLikes, 0 )
  return result
}

module.exports = {
  totalLikes
}