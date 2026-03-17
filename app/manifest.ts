import { type MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Craft Flow",
    short_name: "Craft Flow",
    description: "A modern Next.js application with Tailwind CSS.",
    start_url: "/",
    display: "standalone",
    background_color: "#1a202c", // Matches Tailwind's bg-app-background
    theme_color: "#1a202c" // Matches Tailwind's bg-app-background
  };
}
