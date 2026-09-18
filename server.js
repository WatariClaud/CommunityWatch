import { createServer } from 'node:http';
import next from 'next';
import cors from 'cors';
import express, { Router } from 'express';
import apiV1Routes from './backend/routes/v1.js';

const port = Number.parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  server.use(cors())
  
  const apiRouter = Router();
  apiRouter.use('/v1', apiV1Routes);

  server.use((req, res, nextRoute) => {
    const host = req.headers.host || '';
    
    if (host.startsWith('api.')) {
      return apiRouter(req, res, nextRoute);
    }
    
    return handle(req, res);
  });

  createServer(server).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port} and http://api.localhost:${port}`);
  });
});