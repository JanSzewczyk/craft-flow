/**
 * Team members data for About page
 */
export const TEAM = [
  {
    id: "marek-kowalski",
    name: "Marek Kowalski",
    role: "CEO & Założyciel",
    bio: "Wychowany w stolarni, wierzy, że technologia to najlepszy przyjaciel dłuta.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA-HUkCzCjTo2yNZDBvZagkg4AxBc3ugPeeIT92n4dnhC8g7wC1O074UN6NVPzTgT2SkOqxKTcm2RHkiuFh9EmPzIiFCPnxATMeOEcdbpK_7RvQuTvGcMNVzlVss2yeHy2Gu_h665ibj5kMuesO0noO_HmBNVWahCNg-Ni3fyG9faKgaAO3S63ulEtI1VZ7lwgQ8TLBuBecP0LAdfhtwIxTciLf0XRcpkpCgNYHMyjH5kJpCbjkAIMA-hW_qMsfHKzczZ3mz7HS3jw",
    socials: {
      linkedin: "#",
      twitter: "#"
    }
  },
  {
    id: "anna-nowak",
    name: "Anna Nowak",
    role: "CTO",
    bio: "Programistka z duszą artysty, pasjonuje się optymalizacją procesów twórczych.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAwTMJzlbRSXY70ucofASHJVwC_zff4b6klPWTbUpCRml8_I_HIh2E0NqOPMKh6TgTNMqc-8Rno0Cly5A4_u_T_JmIgJY5gGv8_fbDXJ8f4oUehzPoSBwR1ebm0kWNEJRJnkbdgVzvO7LY4f1bV9rsvGL5Uz3_-CRbDOzvkF-cQCkPMf-xhR5qOtwQ7dzqaorwUGfLMIc9SXeurapuHLKahd2FQljGa2G_N-M_4q7yVkDHDOGOXrS8pXetOnRlBimpVVQw7J0XfP2U",
    socials: {
      linkedin: "#",
      twitter: "#"
    }
  },
  {
    id: "tomasz-wisniewski",
    name: "Tomasz Wiśniewski",
    role: "Lead Designer",
    bio: "Dba o to, by każda ikona i przycisk w CraftFlow były tak solidne jak dębowy stół.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5rYPnzD2OarHi_oB5QgUvoIRBkgyVIIWbY5cgulGJ0kHUilBZAOn-i3sIjWRfLuitT9ifUJSX0Yr1qwL9SQe4yIBGQOhKCPO3T_B-MazBfe166sXGc_NKjjYbeZgSJiTa15xSdrkIfJaRN4zFBletDBCV6L-QNgqF8FMjt2DDzCuiMCSPH_UTpxqVzGrqqKBL_VtckHecHSMQ_FWrUIHSAqy3UTpD5pP8b46YrXoqOcVK7K-ozrVWi6vcaPVZX0kNqr_-6JjjiNc",
    socials: {
      linkedin: "#",
      twitter: "#"
    }
  },
  {
    id: "julia-lis",
    name: "Julia Lis",
    role: "Customer Success",
    bio: "Kocha kontakt z ludźmi i słuchanie historii o tym, jak ich rzemiosło zmienia świat.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCYcOvayP720BE0_bqREeZ7gYR0zJZY-qDzYshEopM5IDXmcsSxmxSt4puUSavsjP3rcLKqWFOYmHQB3B0--gSJ0PQh9VFk_CBXqzzaNf3s2McTf9Rj7dq6qL2JEBrB9S9eHEXpB3M0SLSUlX1zAdebfH7bHzJiP8GlPaciNYciPary2faSnQlu6Z9xz3D54YcHF9elZ4caPFWh54k23rSRxtBSKiGoHJCTlaAKnFkXj6eCEMVvJd0cifFvkrYzQtQhjO4OPasBL9s",
    socials: {
      linkedin: "#",
      twitter: "#"
    }
  }
] as const;

export type TeamMember = (typeof TEAM)[number];
