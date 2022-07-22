import { Express } from 'express';
import { recognizeText } from '../controller/imageController';
import multer from 'multer';
import { storage } from '../utils/multer';
const upload = multer({ storage: storage});

export = (app: Express) => {
  app.route('/api/image/ocr')
    .post(upload.array('images'), recognizeText);
}