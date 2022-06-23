import express from 'express';
import { SERVER_PORT } from '../global/environment';
import socketIO from 'socket.io';
import http from 'http';

// Importamos nuestro archivo con las funciones personalizadas de los sockets
import * as socket from '../sockets/socket';

export default class Server {

    private static _instance: Server;

    public app: express.Application;
    public port: number;

    public io: socketIO.Server;
    private httpServer: http.Server;

    // Ponemos privado el constructor, para evitar multiples instancias. Usamos el patron singleton en el getter instance
    private constructor() {

        this.app = express();
        this.port = SERVER_PORT;

        // Usamos un httpServer, aparte de express, y le mandamos como parametro el servidor de express, para que ahi pueda correr tambien en ese mismo server Socket.IO
        this.httpServer = new http.Server(this.app);

        this.io = new socketIO.Server( this.httpServer, { cors: { origin: true, credentials: true } } );

        this.escucharSockets();

    }

    // Implementamos Singleton
    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    private escucharSockets() {

        console.log('Escuchando conexiones - sockets');

        this.io.on('connection', cliente => {

            console.log('Cliente conectado');

            //Evento de recibir mensajes
            socket.mensaje(cliente, this.io);

            //Evento de desconectar
            socket.desconectar(cliente);



        });

    }

    start(callback: VoidFunction) {

        // this.app.listen(this.port, callback);
        this.httpServer.listen(this.port, callback);

        

    }

}