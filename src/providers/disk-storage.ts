import fs from "node:fs";
import path from "node:path";

import uploadConfig from "@/configs/upload";

class DiskStorage {
  async saveFile(file: string){
    const tpmPath = path.resolve(uploadConfig.TMP_FOLDER, file);
    const destPath = path.resolve(uploadConfig.UPLOADS_FOLDER, file);

    try {
      await fs.promises.access(tpmPath);
    } catch (err) {
      console.log(err);
      throw new Error(`Arquivo não encontrado: ${tpmPath}`);
    }

    await fs.promises.mkdir(uploadConfig.UPLOADS_FOLDER, { recursive: true });
    await fs.promises.rename(tpmPath, destPath);

    console.log(`Arquivo movido para: ${destPath}`);
    return file;
  }

  async deleteFile(file: string, type: "tmp" | "uploads") {
    const pathFile = 
      type === "tmp" ? uploadConfig.TMP_FOLDER : uploadConfig.UPLOADS_FOLDER;
    
    const filePath = path.resolve(pathFile, file);
    
    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
    console.log(`Arquivo deletado: ${filePath}`);
  }
}

export { DiskStorage };