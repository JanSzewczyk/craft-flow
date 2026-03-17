/**
 * FAQ items for pricing page
 */
export const FAQ_ITEMS = [
  {
    question: "Czy mogę zrezygnować w dowolnym momencie?",
    answer:
      "Tak, subskrypcja jest miesięczna i możesz ją anulować w dowolnym momencie bez dodatkowych kosztów. Twoje dane pozostaną bezpieczne przez 30 dni od rezygnacji."
  },
  {
    question: "Jak działa darmowy trial?",
    answer:
      "Darmowy trial 14-dniowy dotyczy wyłącznie planu Basic. Pozwala on na przetestowanie podstawowych funkcjonalności bez żadnych zobowiązań i konieczności podawania danych karty."
  },
  {
    question: "Czy mój klient musi zakładać konto?",
    answer:
      'Nie! Dzięki funkcji "Smart Links" Twoi klienci mogą śledzić postępy prac i zatwierdzać projekty bez konieczności rejestracji. Otrzymują unikalny link do swojego panelu.'
  },
  {
    question: "Czy mogę zmienić plan w trakcie trwania subskrypcji?",
    answer:
      "Tak, możesz zmienić plan na wyższy lub niższy w dowolnym momencie. Zmiany zostaną rozliczone proporcjonalnie w następnym cyklu rozliczeniowym."
  },
  {
    question: "Jakie metody płatności są obsługiwane?",
    answer:
      "Obsługujemy płatności kartami płatniczymi (Visa, Mastercard), przelewy online oraz płatności mobilne BLIK za pośrednictwem bezpiecznego systemu Stripe."
  },
  {
    question: "Czy moje dane są bezpieczne?",
    answer:
      "Bezpieczeństwo Twoich danych jest naszym priorytetem. Korzystamy z szyfrowania SSL oraz infrastruktury Firebase, która spełnia najwyższe standardy bezpieczeństwa i zgodności z RODO."
  },
  {
    question: "Co się stanie po zakończeniu 14-dniowego trialu?",
    answer:
      "Po 14 dniach dostęp do funkcji planu Basic zostanie zablokowany, chyba że zdecydujesz się na dodanie metody płatności i kontynuowanie subskrypcji. Nie obciążymy Cię automatycznie."
  }
] as const;

export type FaqItem = (typeof FAQ_ITEMS)[number];
