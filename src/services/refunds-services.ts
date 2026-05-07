import { Request, Response } from "express";
import { prisma } from "@/database/prisma"

import { Refund } from "@/types/refund";
import { AuthenticatedUser } from "@/types/authenticatedUser";
import { AppError } from "@/utils/AppError";

async function createRefund(refundData: Refund, req: Request) {

  if (!req.user) {
    throw new AppError("Usuário não autorizado.", 401);
  }

  const user: AuthenticatedUser = req.user;

  const newRefund = await prisma.refunds.create({
    data: {
      name: refundData.name,
      category: refundData.category,
      amount: refundData.amount,
      filename: refundData.filename,
      userId: user.id,
    }
  });

  return { newRefund };
}

async function listRefunds( query: { 
  name: string, page: number, perPage: number } = 
  { name: "", page: 1, perPage: 10 }
){

  const { name, page, perPage } = query;

  const skip = (page - 1) * perPage;

  const refunds = await prisma.refunds.findMany({
    skip: skip,
    take: perPage,
    where: {
      user: {
        name: {
          contains: name.trim(),
          mode: 'insensitive',
        }
      }
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        }
      }
    },
  });

  const totalRecords = await prisma.refunds.count({
    where: {
      user: {
        name: {
          contains: name.trim(),
          mode: 'insensitive',
        }
      }
    },
  });

  const totalPages = Math.ceil(totalRecords / perPage);

  return { 
    refunds, 
    pagination: {
      page,
      perPage, 
      totalRecords,
      totalPages: totalPages > 0 ? totalPages : 1, 
    } 
  };
}

export { createRefund, listRefunds };