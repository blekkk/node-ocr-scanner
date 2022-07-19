import { Request, Response } from "express";
import fs from 'fs';
import { readFile } from "fs/promises";
import { promisify } from "util";
import tesseract from "node-tesseract-ocr";
import sharp from "sharp";

export const recognizeText = async (req: Request, res: Response) => {
  const filesMulter = req.files! as Array<Express.Multer.File>;
  const files = filesMulter.map(file => file);
  const resultArr = [];
  const unlinkAsync = promisify(fs.unlink);

  if (!filesMulter) {
    return res.status(500).send('No file uploaded');
  }

  try {
    for (let i = 0; i < files.length; i++) {
      const file = await readFile(files[i].path);

      // decrease saturation a little
      const image = await sharp(file).modulate({ saturation: 0.9 }).toBuffer();

      const result = await tesseract.recognize(image, {
        lang: 'ind',
      });

      if (result) {
        resultArr.push({
          text: result.replace(/^\s*$(?:\r\n?|\n)/gm, "") //erase empty lines
        });
      }

      // delete images after use
      await unlinkAsync(files[i].path)
    }

    res.status(200).json({
      data: resultArr
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}