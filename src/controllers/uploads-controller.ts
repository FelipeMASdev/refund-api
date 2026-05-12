import { Request, Response } from 'express';
import z, { ZodError } from 'zod';

import uploadConfig from "@/configs/upload";
import upload from '@/configs/upload';
import { DiskStorage } from '@/providers/disk-storage';
import { AppError } from '@/utils/AppError';

class UploadsController { 
  async create(req: Request, res: Response) {
    const diskStorage = new DiskStorage();

    try {
      const fileSchema = z.looseObject({
        filename: z
          .string()
          .min(1, { message: "Arquivo é obrigatório" }),
        mimetype: z
          .string()
          .refine((type) => uploadConfig.ACCEPTED_IMAGE_TYPES.includes(type), {
            message: `Formato de arquivo inválido. Formatos aceitos: ${uploadConfig.ACCEPTED_IMAGE_TYPES.join(", ")}`
          }),
        size: z
          .number()
          .positive()
          .refine((size) => size <= uploadConfig.MAX_FILE_SIZE, {
            message: `Arquivo excede o tamanho máximo permitido de: ${uploadConfig.MAX_SIZE_MB} MB`
          }),
      });

      const file = fileSchema.parse(req.file);
      const filename = await diskStorage.saveFile(file.filename);

      return res.status(201).json({ message: "Upload realizado com sucesso!", filename });

    } catch (err) {
      if (err instanceof ZodError) {
        if( req.file) {
          await diskStorage.deleteFile(req.file.filename, "tmp");
        }

        throw new AppError (err.issues[0].message, 400);
      }

      throw err;
    }
  }
}

export { UploadsController };