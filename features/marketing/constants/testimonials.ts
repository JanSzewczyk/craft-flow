/**
 * Testimonials data for marketing page
 */
export const TESTIMONIALS = [
  {
    quote:
      "Odkąd korzystam z CraftFlow, klienci przestali dzwonić z pytaniem 'kiedy będzie gotowe'. Portal robi to za mnie — klient wchodzi, sprawdza, jest spokojny. Oszczędzam co najmniej godzinę telefonów dziennie.",
    name: "Marek Wiśniewski",
    trade: "Stolarz",
    city: "Wrocław",
    initials: "MW"
  },
  {
    quote:
      "Wygląda to bardzo profesjonalnie — klient dostaje linka do swojego projektu i widzi wszystko na bieżąco. Miałem już kilka sytuacji, gdzie klient polecił mnie dalej właśnie przez ten portal. To najlepszy marketing, jaki mogłem sobie zrobić.",
    name: "Piotr Zając",
    trade: "Elektryk",
    city: "Kraków",
    initials: "PZ"
  },
  {
    quote:
      "Wcześniej gubiłem zdjęcia po różnych folderach na telefonie. Teraz wszystko jest w jednym miejscu, klient widzi postęp, a ja mam porządek w dokumentacji. CraftFlow to coś, czego szukałem od lat.",
    name: "Tomasz Nowak",
    trade: "Glazurnik",
    city: "Poznań",
    initials: "TN"
  }
] as const;

export type Testimonial = (typeof TESTIMONIALS)[number];
