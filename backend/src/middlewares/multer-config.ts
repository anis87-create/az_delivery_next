import * as multer from 'multer';
import { Request } from 'express';
import * as  path from 'path';

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) => {
    callback(null, path.join(process.cwd(), 'images'));
  },
  filename: (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
    // Extraire le nom sans extension
    const nameWithoutExt = path.parse(file.originalname).name || 'file';

    // Extraire l'extension depuis le nom du fichier original
    const extension = path.extname(file.originalname).substring(1); // Enlever le point

    // Générer le nom de fichier unique
    const uniqueFilename = `${nameWithoutExt}_${Date.now()}.${extension}`;

    callback(null, uniqueFilename);
  }
});

const multerStorage = multer({ storage: storage }).fields([{ name: 'img', maxCount: 1 }, { name: 'coverImg', maxCount: 1 }]);

export default multerStorage;