import * as path from 'path'

import { Server } from 'socket.io'
import { createServer } from 'http'
import express from 'express'

const app = express()
const http = createServer(app)
const ioServer = new Server(http)
const port = process.env.PORT || 2000

// Serveer client-side bestanden
app.use(express.static(path.resolve('public')))

// Start de socket.io server op
ioServer.on('connection', (client) => {
    console.log(`user ${client.id} connected`);

    // Luister naar een message van een gebruiker
    client.on('message', (message) => {
        console.log(`user ${client.id} sent message: ${message}`)
        
        // Verstuur het bericht naar alle clients
        ioServer.emit('message', message);
    });

    // Luister naar een disconnect van een gebruiker
    client.on('disconnect', () => {
        console.log(`user ${client.id} disconnected`);
    });
});

// Start een http server op het ingestelde poortnummer en log de url
http.listen(port, () => {
  console.log('listening on http://localhost:' + port)
})