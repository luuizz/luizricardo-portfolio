"use server";

import { withAuthAction as withAction } from "@/lib/actions/with-action";
import {
  createBudgetService,
  updateBudgetService,
  softDeleteBudgetService,
} from "@/lib/services/budgets.service";

interface BudgetInput {
  title: string;
  client_id?: string;
  total?: number;
  status?: "draft" | "sent" | "approved" | "rejected";
  notes?: string;
}

export const createBudgetAction = async (input: BudgetInput) =>
  withAction(() => createBudgetService(input));

export const updateBudgetAction = async (id: string, input: Partial<BudgetInput>) =>
  withAction(() => updateBudgetService(id, input));

export const deleteBudgetAction = async (id: string) =>
  withAction(async () => { await softDeleteBudgetService(id); return { id }; });
