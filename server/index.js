import Fastify from 'fastify'
import fastifyCors from '@fastify/cors'
const fastify = Fastify({
  logger: true
})
fastify.register(fastifyCors, { origin: '*' })

fastify.get('/', async (request, reply) => {
  reply.send({ hello: 'world' })
})

fastify.post('/file/upload', async (request, reply) => {
  console.log(request.body)
})

const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
