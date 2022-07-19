import {Express} from 'express';
import imageRoutes from './imageRoutes';

export = (app: Express) => {
  imageRoutes(app);
}