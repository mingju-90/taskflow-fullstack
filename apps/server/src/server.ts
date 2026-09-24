import { createServer } from 'node:http'
import { createApp } from './app.js'
import { env } from './config/env.js'

const server = createServer(createApp())

server.listen(env.PORT, '127.0.0.1')
