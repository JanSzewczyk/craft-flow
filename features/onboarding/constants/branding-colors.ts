export const BRAND_COLOR_PRESETS = [
  { value: "#2563EB", label: "Niebieski" },
  { value: "#7C3AED", label: "Fioletowy" },
  { value: "#F59E0B", label: "Bursztynowy" },
  { value: "#10B981", label: "Zielony" },
  { value: "#EF4444", label: "Czerwony" }
] as const;

export const DEFAULT_BRAND_COLOR = BRAND_COLOR_PRESETS[0].value;
