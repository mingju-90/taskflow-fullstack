import { createServer } from 'node:http'
import { createApp } from './app'
import { env } from './config/env'

const server = createServer(createApp())

server.listen(env.PORT, '127.0.0.1')
