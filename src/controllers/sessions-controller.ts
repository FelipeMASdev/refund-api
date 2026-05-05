import { z } from "zod";
import { Request, Response } from "express";
import { signIn } from "@/services/sessions-services";

import { SignIn } from "@/types/signIn";

class SessionsController {
  async create(req: Request, res: Response) {

    const bodySchema = z.object({
      email: z.email( { message: "Email inválido." }),
      password: z.string().min(1, { message: "Por favor, informe a senha." }),
    });

    const signInInfo: SignIn = bodySchema.parse(req.body);

    const result = await signIn(signInInfo);



    return res.status(200).json({ message: "Sessão criada com sucesso!", result });
  }
}

export { SessionsController };