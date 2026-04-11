import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Nowy projekt"
};

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-heading-h1">Nowy projekt</h1>
      <p className="text-mute">Wkrótce...</p>
    </div>
  );
}
