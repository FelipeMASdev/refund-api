import { Request, Response } from "express";
import { z } from "zod";

import { UserRole } from "@/generated/prisma/enums";
import { NewUser } from "@/types/newUser";

import { createUser } from "@/services/user-services";

class UsersController{
  async create(req: Request, res: Response){
    const bodySchema = z.object({
      name: z
        .string({
          message: "Nome é obrigatório."
        })
        .trim()
        .min(2, { 
          message: "Nome é obrigatório e deve ter pelo menos 2 caracteres." 
        }),
      email: z
        .email({ 
          message: "Email inválido." 
        })
        .trim()
        .toLowerCase(),
      password: z
        .string({
          message: "Senha é obrigatória."
        } )
        .min(6, { 
          message: "A senha deve ter pelo menos 6 caracteres." 
        }),
      role: z
      .enum([UserRole.employee, UserRole.manager], { 
        message: "Cargo inválido, deve ser 'employee' ou 'manager'." 
      })
      .default(UserRole.employee),
    });

    const { name, email, password, role } = bodySchema.parse(req.body);

    const newUser: NewUser = {
      name,
      email,
      password,
      role
    };

    const user = await createUser(newUser);

    return res.status(201).json({ user: user });
  }
}

export { UsersController };