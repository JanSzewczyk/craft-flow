import { expect } from "storybook/test";

import { ContactEmail } from "./contact-email";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Contact/Templates/Contact Email",
  component: ContactEmail,
  args: {
    data: {
      name: "Jan Kowalski",
      email: "jan@firma.pl",
      subject: "demo",
      message: "Chciałbym umówić się na prezentację systemu CraftFlow dla mojego warsztatu samochodowego."
    }
  },
  parameters: {
    layout: "padded"
  }
});

export const Email = meta.story({ name: "Contact Email" });

Email.test("Renders all email content correctly", async ({ canvas, args }) => {
  await expect(canvas.getByRole("heading")).toHaveTextContent("Nowa wiadomość z formularza kontaktowego");
  await expect(canvas.getByText(args.data.name)).toBeVisible();
  await expect(canvas.getByText(args.data.email)).toBeVisible();
  await expect(canvas.getByText("Prezentacja systemu (Demo)")).toBeVisible();
  await expect(canvas.getByText(args.data.message)).toBeVisible();
  await expect(canvas.getByText("Imię i nazwisko")).toBeVisible();
  await expect(canvas.getByText("Adres e-mail")).toBeVisible();
  await expect(canvas.getByText("Temat")).toBeVisible();
  await expect(canvas.getByText("Wiadomość")).toBeVisible();
});
