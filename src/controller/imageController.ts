import { Request, Response, Express } from "express";
import fs from 'fs';
import { readFile } from "fs/promises";
import { promisify } from "util";
import tesseract from "node-tesseract-ocr";
import sharp from "sharp";
const config = {
  lang: "ind",
}

export const recognizeText = async (req: Request, res: Response) => {
  const filesMulter = req.files! as Array<Express.Multer.File>;
  const files = filesMulter.map(file => file);
  const resultArr = [];
  const unlinkAsync = promisify(fs.unlink);
  console.log(files);

  if (!filesMulter) {
    return res.status(500).send('No file uploaded');
  }

  for (let i = 0; i < files.length; i++) {
    const file = await readFile(files[i].path);

    const image  = await sharp(file).modulate({ saturation: 0.9 }).toBuffer();

    const result = await tesseract.recognize(image, config);

    if (result) {
      resultArr.push({
        text: result.replace(/^\s*$(?:\r\n?|\n)/gm, "")
      });
    }

    await unlinkAsync(files[i].path)
  }

  console.log(resultArr);

  res.status(200).json({
    data: resultArr
  });
}