import { expect } from "storybook/test";

import { PhoneMockup } from "./phone-mockup";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/Onboarding/Phone Mockup",
  component: PhoneMockup,
  parameters: {
    layout: "centered"
  }
});

export const Default = meta.story({
  name: "Default",
  args: {
    children: (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
        <p className="text-foreground text-sm font-semibold">Craft Flow</p>
        <p className="text-muted-foreground text-center text-xs">Witaj w aplikacji dla profesjonalistów</p>
      </div>
    )
  }
});

Default.test("Renders children content inside the screen", async ({ canvas }) => {
  const heading = canvas.getByText("Craft Flow");
  await expect(heading).toBeVisible();

  const subtitle = canvas.getByText("Witaj w aplikacji dla profesjonalistów");
  await expect(subtitle).toBeVisible();
});

export const Empty = meta.story({
  name: "Empty",
  args: {
    children: <span data-testid="empty-screen" />
  }
});

Empty.test("Renders empty screen without content", async ({ canvas }) => {
  const emptyScreen = canvas.getByTestId("empty-screen");
  await expect(emptyScreen).toBeInTheDocument();
  await expect(emptyScreen).toBeEmptyDOMElement();
});

export const WithCustomClassName = meta.story({
  name: "With Custom Class Name",
  args: {
    className: "border-blue-500",
    children: <p className="p-4 text-xs">Custom border color</p>
  }
});

WithCustomClassName.test("Renders children when custom className is applied", async ({ canvas }) => {
  const text = canvas.getByText("Custom border color");
  await expect(text).toBeVisible();
});
