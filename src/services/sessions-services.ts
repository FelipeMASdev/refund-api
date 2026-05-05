import { SignIn } from "@/types/signIn";

import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

import { compare } from "bcrypt";
import { authconfig } from "@/configs/auth";
import { sign, type SignOptions } from "jsonwebtoken";



async function signIn(signInInfo: SignIn) {
  const user = await prisma.user.findFirst({
    where: {
      email: signInInfo.email,
    },
  });

  if (!user) {
    throw new AppError("Email ou senha inválidos.", 401);
  }
  
  const passwordMatched = await compare(signInInfo.password, user.password);

  if (!passwordMatched) {
    throw new AppError("Email ou senha inválidos.", 401);
  }

  const { secret, expiresIn } = authconfig.jwt;

  const signOptions: SignOptions = {
    subject: user.id,
    expiresIn: expiresIn as SignOptions["expiresIn"],
  };

  const token = sign({ role: user.role }, secret!, signOptions);

  const userWithoutPassword = { ...user, password: undefined };

  return { token, user: userWithoutPassword };
}

export { signIn };