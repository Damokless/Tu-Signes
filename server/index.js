import Fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifyMultipart from '@fastify/multipart'
import { PDFDocument } from 'pdf-lib'
import 'dotenv/config'
const fastify = Fastify({
  logger: true
})
fastify.register(fastifyCors, { origin: '*' }).register(fastifyMultipart)

fastify.post('/file/upload', async (request, reply) => {
  const data = await request.file()
  const buffer = await data.toBuffer()
  const pdf = await PDFDocument.load(buffer)
  const pages = pdf.getPages().length0
  const content = buffer.toString('base64')
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: data.fields.file.filename,
      content
    })
  }
  const response = await fetch('https://staging-api.yousign.com/files', options)
  const dataFile = await response.json()
  const membersArray = []
  for (const recipient of data.fields['recipients[]']) {
    membersArray.push({
      email: recipient.value,
      firstname: 'john',
      lastname: 'doe',
      phone: '0123456789',
      fileObjects: [{
        file: dataFile.id,
        page: pages,
        position: '230,499,464,589',
        mention: 'Read and approved',
        mention2: 'Signed by John Doe'
      }]
    })
  }
  const optionsProcedures = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: `procedure for ${data.fields.file.filename}`,
      description: `${data.fields.file.filename}`,
      members: membersArray,
      config: {
        email: {
          'member.started': [
            {
              subject: 'Hey! You are invited to sign!',
              message: 'Hello <tag data-tag-type="string" data-tag-name="recipient.firstname"></tag> <tag data-tag-type="string" data-tag-name="recipient.lastname"></tag>, <br><br> You have ben invited to sign a document, please click on the following button to read it: <tag data-tag-type="button" data-tag-name="url" data-tag-title="Access to documents">Access to documents</tag>',
              to: [
                '@member'
              ]
            }
          ],
          'procedure.started': [
            {
              subject: 'John, created a procedure your API have.',
              message: 'The content of this email is totally awesome.',
              to: [
                '@creator',
                '@members'
              ]
            }
          ]
        }
      }
    })
  }
  const responseProcedure = await fetch('https://staging-api.yousign.com/procedures', optionsProcedures)
  console.log(await responseProcedure.json())
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
