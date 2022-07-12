import Fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifyMultipart from '@fastify/multipart'
import fs from 'fs'
const fastify = Fastify({
  logger: true
})
fastify.register(fastifyCors, { origin: '*' }).register(fastifyMultipart)

fastify.post('/file/upload', async (request, reply) => {
  const data = await request.file()
  fs.createWriteStream(data.fields.file.filename).write(await data.toBuffer())
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
