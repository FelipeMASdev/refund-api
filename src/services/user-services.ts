import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { hash } from "bcrypt";

import { NewUser } from "@/types/newUser";

async function createUser(newUser: NewUser) {
 const userWithSameEmail = await prisma.user.findFirst({
  where: {
    email: newUser.email,
  },
 });

 if (userWithSameEmail) {
  throw new AppError("Já existe um usuário com esse email.", 400);
 }

 const hashedPassword = await hash(newUser.password, 8);

  const user = await prisma.user.create({
    data: {
      name: newUser.name,
      email: newUser.email,
      password: hashedPassword,
      role: newUser.role,
    },
  });

  const userWithoutPassword = { ...user, password: undefined };

  return userWithoutPassword;
}

export { createUser };