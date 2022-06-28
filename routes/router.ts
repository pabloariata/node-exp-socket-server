import { Router, Request, Response, request, response } from 'express';
import Server from '../classes/server';

import { usuariosConectados } from '../sockets/socket';


const router = Router();


router.get('/mensajes', (req: Request, res: Response) => {

    res.json({
        ok: true,
        mensaje: 'Todo está bien!!'
    });

});

router.post('/mensajes', (req: Request, res: Response) => {

    const cuerpo = req.body.cuerpo;
    const de = req.body.de;

    const payload = {
        de, 
        cuerpo
    }

    const server = Server.instance;

    server.io.emit('mensaje-nuevo', payload);

    res.json({
        ok: true,
        mensaje: 'POST Ready!!',
        cuerpo,
        de
    });

});

router.post('/mensajes/:id', (req: Request, res: Response) => {

    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    
    const id = req.params.id;

    
    const payload = {
        de,
        cuerpo
    }

    // al ser un singleton, es la misma instancia que esta corriendo en la app de node
    const server = Server.instance;

    server.io.in(id).emit('mensaje-privado', payload);

    res.json({
        ok: true,
        mensaje: 'Mensaje privado enviado',
        cuerpo,
        de,
        id
    });

});


// Servicio para obtener todos los IDs de los usuarios

router.get('/usuarios', (req: Request, res: Response) => {


    const server = Server.instance;

    // Obtenemos los ids de los sockets conectados
    server.io.allSockets().then((clientes)=> {

        console.log(clientes);

        res.json({
            ok: true,
            clientes: Array.from(clientes)
        })

    });


});

// Obtener usuarios y sus nombres

router.get('/usuarios/detalle', (req: Request, res: Response) => {

    res.json({
        ok: true,
        clientes: usuariosConectados.getLista()
    });

});

export default router;