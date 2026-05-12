import { Request, Response, NextFunction } from "express";

import { verify } from "jsonwebtoken";
import { authconfig } from "@/configs/auth";
import { AppError } from "@/utils/AppError";

interface TokenPayload {
  role: string;
  sub: string;
}

function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token JWT não encontrado.", 401);
  }
  
  const [, token] = authHeader.split(" ");

  if (!token) {
    throw new AppError("Token JWT não encontrado.", 401);
  }

  try {
    const secret = authconfig.jwt.secret;

    if (!secret) {
      throw new AppError("JWT secret não encontrado.", 500);
    }

    const decodedToken = verify(token, secret);
    const { role, sub: user_id } = decodedToken as TokenPayload;

    request.user = {
      id: user_id,
      role,
    };

    return next();
  } catch (err) {
    throw new AppError("Token JWT inválido.", 401);
  }
}

export { ensureAuthenticated };