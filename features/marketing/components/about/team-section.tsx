import { XLogoIcon } from "@szum-tech/design-system/icons";

import { LinkedInIcon } from "~/features/marketing/components/social-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@szum-tech/design-system";
import { TEAM } from "~/features/marketing/constants";

type TeamMemberCardProps = {
  name: string;
  role: string;
  bio: string;
  image: string;
  socials: {
    linkedin: string;
    twitter: string;
  };
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function TeamMemberCard({ name, role, bio, image, socials }: TeamMemberCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <Avatar className="mb-6 size-32">
        <AvatarImage alt={name} src={image} />
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>

      <h3 className="text-heading-h4 mb-1">{name}</h3>
      <p className="text-primary mb-4 font-bold">{role}</p>
      <p className="text-body-sm text-muted-foreground mb-6">{bio}</p>
      <div className="flex gap-4">
        <a
          className="text-muted-foreground hover:text-primary transition-colors"
          href={socials.linkedin}
          aria-label={`${name} na LinkedIn`}
        >
          <LinkedInIcon className="size-6" aria-hidden="true" />
        </a>
        <a
          className="text-muted-foreground hover:text-primary transition-colors"
          href={socials.twitter}
          aria-label={`${name} na Twitter`}
        >
          <XLogoIcon className="size-6" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

export function TeamSection() {
  return (
    <section className="container py-16">
      <div className="mb-16 text-center">
        <h2 className="text-display-sm">Poznaj nasz zespół</h2>
        <p className="text-lead mx-auto max-w-2xl">
          Jesteśmy grupą pasjonatów, którzy chcą zmienić sposób, w jaki rzemieślnicy zarządzają swoimi warsztatami.
        </p>
      </div>

      <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
        {TEAM.map((member) => (
          <TeamMemberCard key={member.id} {...member} />
        ))}
      </div>
    </section>
  );
}
