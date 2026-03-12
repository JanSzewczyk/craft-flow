/**
 * FAQ items for pricing page
 */
export const FAQ_ITEMS = [
  {
    question: "Czy mogę wypróbować CraftFlow za darmo?",
    answer:
      "Tak, każde nowe konto otrzymuje 14 dni dostępu do planu Premium bez konieczności podania karty kredytowej. Po tym czasie możesz wybrać plan płatny (Basic, Standard lub Premium). CraftFlow nie oferuje bezpłatnego planu — po zakończeniu okresu próbnego konieczne jest wybranie jednego z dostępnych planów płatnych."
  },
  {
    question: "Jak wygląda rozliczenie? Czy mogę anulować w dowolnym momencie?",
    answer:
      "Rozliczamy miesięcznie z góry. Możesz anulować subskrypcję w dowolnym momencie — nie ma umów długoterminowych ani kar za rezygnację. Po anulowaniu zachowujesz dostęp do końca opłaconego okresu rozliczeniowego."
  },
  {
    question: "Czym różni się limit projektów między planami?",
    answer:
      "Limit dotyczy liczby nowo tworzonych projektów w danym miesiącu rozliczeniowym. Projekty zakończone i zarchiwizowane nie wliczają się do limitu. Plan Basic umożliwia tworzenie do 5 projektów miesięcznie, Standard do 20, a Premium nie ma żadnych ograniczeń."
  },
  {
    question: "Czy mój klient musi zakładać konto, żeby zobaczyć projekt?",
    answer:
      "Nie. Każdy projekt ma unikalny link — klient otwiera go w przeglądarce bez rejestracji. Opcjonalnie może założyć konto, żeby mieć dostęp do historii wszystkich swoich zleceń i łatwiej śledzić postępy kolejnych projektów."
  },
  {
    question: "Co to jest własny branding?",
    answer:
      "Na planach Standard i Premium możesz dodać swoje logo i kolor marki. Klient widzi Twój portal — nie logo CraftFlow. Na planie Basic portal wyświetla branding CraftFlow zamiast Twoich danych wizualnych."
  },
  {
    question: "Co się dzieje z moimi danymi po anulowaniu subskrypcji?",
    answer:
      "Twoje dane są bezpieczne przez 30 dni po anulowaniu. W tym czasie możesz je wyeksportować lub wznowić subskrypcję bez utraty danych. Po 30 dniach dane są trwale usuwane z naszych serwerów."
  },
  {
    question: "Czy mogę zmienić plan w trakcie miesiąca?",
    answer:
      "Tak. Możesz przejść na wyższy plan w dowolnym momencie — różnica jest naliczana proporcjonalnie za pozostałe dni okresu rozliczeniowego. Przejście na niższy plan następuje automatycznie od początku kolejnego okresu rozliczeniowego."
  },
  {
    question: "Czy CraftFlow działa na telefonie?",
    answer:
      "Tak. Interfejs wykonawcy jest w pełni responsywny i działa płynnie na telefonach i tabletach. Portal klienta jest zoptymalizowany pod urządzenia mobilne — klienci mogą bez problemu przeglądać projekty i zatwierdzać wyceny na smartfonie."
  }
] as const;

export type FaqItem = (typeof FAQ_ITEMS)[number];
