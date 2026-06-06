import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

export function formatDate(
  date: string | Date | null | undefined,
  pattern = "dd MMM yyyy",
) {
  if (!date) return "-";

  try {
    return format(new Date(date), pattern, { locale: ptBR });
  } catch {
    return "-";
  }
}
