const logger = (request, response, next) => {
  if ( process.env.NODE_ENV === 'test' ) {
    return next()
  }
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const error = (request, response) => {
  console.log(request)
  response.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtractor = (request, response, next) => {
  let token
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    token = authorization.substring(7)
  }
  request.token = token
  next()
}

module.exports = {  logger, error, tokenExtractor }