import { Category } from "@/generated/prisma/enums";
import { Request, Response } from "express";
import { z } from "zod";

import { Refund } from "@/types/refund";

import { createRefund, listRefunds, getRefundById } from "@/services/refunds-services";

export const CategoriesEnum = z.enum([
  "food",
  "others",
  "services",
  "transportation",
  "accommodation",
]);

class RefundsController {
  async create(req: Request, res: Response) {
    const bodySchema = z.object({
      name: z
        .string({ message: "Por favor, informe o nome da solicitação." })
        .trim()
        .min(1, { message: "Por favor, informe o nome da solicitação." }),
      category: z
        .enum(CategoriesEnum.options, {
          message: "Categoria inválida. As categorias válidas são: food, others, services, transportation, accommodation.",
        }),
      amount: z
        .number({ message: "Por favor, informe o valor da solicitação." })
        .positive({ message: "O valor deve ser positivo." }),
      filename: z
        .string({ message: "Por favor, envie o comprovante." })
        .min(20, { message: "Por favor, envie o comprovante." }),
    });

    const refundData: Refund = bodySchema.parse(req.body);

    const { newRefund } = await createRefund(refundData, req);

    return res.status(201).json({ message: "Solicitação de reembolso criada com sucesso.", refund: newRefund });
  }

  async index(req: Request, res: Response) {
    const querySchema = z.object({
      name: z
        .string()
        .optional()
        .default(""),
      page: z
        .coerce.number()
        .int()
        .positive()
        .optional()
        .default(1),
      perPage: z
        .coerce.number()
        .int()
        .positive()
        .optional()
        .default(10),
    });

    const { name, page, perPage } = querySchema.parse(req.query);

    const { refunds, pagination } = await listRefunds({ name, page, perPage });

    return res.status(200).json({ 
      message: "Listagem de reembolsos obtida com sucesso.", 
      refunds, 
      pagination 
    });
  }

  async show(req: Request, res: Response) {
    const paramSchema = z.object({
      id: z.uuid({ message: "ID de reembolso inválido." }),
    });

    const { id } = paramSchema.parse(req.params);

    const refund = await getRefundById(id);

    return res.status(200).json({ message: "Detalhes do reembolso obtidos com sucesso.", refund });
  }
}

export { RefundsController };