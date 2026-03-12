import { Card, Separator } from "@szum-tech/design-system";

const TEAM = [
  {
    initials: "KN",
    name: "Kamil Nowak",
    role: "Założyciel & CEO",
    bio: "Stolarz z 12-letnim doświadczeniem. Zbudował CraftFlow, bo sam potrzebował takiego narzędzia. Odpowiada za wizję produktu i relacje z użytkownikami."
  },
  {
    initials: "AW",
    name: "Agata Wróbel",
    role: "Head of Design",
    bio: "Projektantka UX z pasją do prostych interfejsów. Dba o to, żeby CraftFlow było intuicyjne nawet dla tych, którzy niechętnie korzystają z technologii."
  },
  {
    initials: "MK",
    name: "Michał Kowalski",
    role: "Lead Developer",
    bio: "Full-stack developer z 8 latach doświadczenia. Odpowiada za to, żeby CraftFlow działało szybko, niezawodnie i bezpiecznie."
  }
] as const;

type TeamMemberCardProps = {
  initials: string;
  name: string;
  role: string;
  bio: string;
};

function TeamMemberCard({ initials, name, role, bio }: TeamMemberCardProps) {
  return (
    <Card className="flex flex-col gap-5 p-6">
      <div className="flex flex-col items-center gap-3">
        <div
          className="bg-primary/10 text-primary text-body-sm flex size-16 items-center justify-center rounded-full font-semibold"
          aria-hidden="true"
        >
          {initials}
        </div>
        <div className="text-center">
          <h3 className="text-heading-h3 text-foreground">{name}</h3>
          <p className="text-body-sm text-muted-foreground">{role}</p>
        </div>
      </div>
      <Separator />
      <p className="text-body-sm text-muted-foreground">{bio}</p>
    </Card>
  );
}

export function TeamSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-display-sm font-poppins text-foreground">Zespół za CraftFlow</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {TEAM.map((member) => (
            <TeamMemberCard key={member.initials} {...member} />
          ))}
        </div>
      </div>
    </section>
  );
}
