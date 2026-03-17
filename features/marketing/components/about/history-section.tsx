import { Mail } from "lucide-react";

import { Button, Card } from "@szum-tech/design-system";
import Image from "next/image";
import Link from "next/link";

export function HistorySection() {
  return (
    <section className="py-24">
      <div className="container">
        <Card className="grid items-center gap-12 p-8 md:p-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Text */}
          <div className="flex flex-col gap-6">
            <div className="space-y-6">
              <p className="text-body-lg">
                CraftFlow narodziło się z pasji do tworzenia i frustracji wynikającej z biurokracji. Wierzymy, że
                technologia powinna pomagać, a nie przeszkadzać w pracy fizycznej.
                <br />
                <br />
                Każda minuta spędzona na arkuszach kalkulacyjnych to minuta odebrana warsztatowi. Naszą misją jest
                eliminacja barier administracyjnych, aby rzemiosło mogło kwitnąć w nowoczesnym świecie.
              </p>
            </div>

            <div className="pt-4">
              <Button asChild variant="outline" startIcon={<Mail aria-hidden="true" />}>
                <Link href="/contact">Skontaktuj się z nami</Link>
              </Button>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNhFAVDT6HZQBc0WQQig7kwD0aL9uzm_-rXXYB2F2d1uAxVqMUuGNaKjjP7ipMTGolrG8fIqo-6hgUNdQfErB4PdGvYwKNSnqIWhkINgCjtBImH1fUvfSj3F2mwZ1fGrOF2tmDySK81DCYbzcXZ45R2E3wEomwPgjl1YOAMRkm0UO1J_slsgAMokOSFUfT4eYjPDKz_5XP0sw2zNE1Op2T6xEwtuXoGOj-9v1yt6gj7DUbM0rH3xuU2BCMfVL0uKAzpWY0eE-ltfw"
              alt="Artisan workshop with tools"
              className="h-full w-full object-cover grayscale transition-all duration-300 group-hover:grayscale-0"
              width={800}
              height={600}
              loading="lazy"
            />
          </div>
        </Card>
      </div>
    </section>
  );
}
