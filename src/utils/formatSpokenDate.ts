import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// "dd/MM/yyyy" é rápido de ler para quem enxerga, mas leitor de tela costuma
// soletrar os números um a um. A versão por extenso fica só para quem usa
// leitor de tela (ver uso com `sr-only`), o texto curto continua visível.
export function formatSpokenDate(dateISO: string): string {
  return format(new Date(`${dateISO}T00:00:00`), "d 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });
}
