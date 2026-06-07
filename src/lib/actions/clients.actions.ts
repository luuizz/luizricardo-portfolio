"use server";

import { withAuthAction as withAction } from "@/lib/actions/with-action";
import {
  createClientService,
  updateClientService,
  softDeleteClientService,
  createSectorService,
  updateSectorService,
  softDeleteSectorService,
} from "@/lib/services/clients.service";
import slugify from "@/app/shared/utils/slugfy";

interface ClientInput {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  sector_id?: string;
  notes?: string;
  status?: "active" | "inactive";
}

interface SectorInput {
  name: string;
  slug?: string;
}

// Clients
export const createClientAction = async (input: ClientInput) =>
  withAction(() => createClientService(input));

export const updateClientAction = async (id: string, input: Partial<ClientInput>) =>
  withAction(() => updateClientService(id, input));

export const deleteClientAction = async (id: string) =>
  withAction(async () => { await softDeleteClientService(id); return { id }; });

// Sectors
export const createSectorAction = async (input: SectorInput) =>
  withAction(async () => {
    const slug = input.slug?.trim() || slugify(input.name);
    return createSectorService({ name: input.name, slug });
  });

export const updateSectorAction = async (id: string, input: Partial<SectorInput>) =>
  withAction(() => updateSectorService(id, input));

export const deleteSectorAction = async (id: string) =>
  withAction(async () => { await softDeleteSectorService(id); return { id }; });
