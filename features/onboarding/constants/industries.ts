export const INDUSTRIES = [
  { value: "stolarstwo", label: "Stolarstwo" },
  { value: "hydraulika", label: "Hydraulika" },
  { value: "elektryka", label: "Elektryka" },
  { value: "remonty", label: "Remonty" },
  { value: "malarstwo", label: "Malarstwo" },
  { value: "dekarstwo", label: "Dekarstwo" },
  { value: "podlogi", label: "Podłogi" },
  { value: "ogrodnictwo", label: "Ogrodnictwo" },
  { value: "hvac", label: "HVAC" },
  { value: "inna", label: "Inna" }
] as const;

export type Industry = (typeof INDUSTRIES)[number]["value"];
