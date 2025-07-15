// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Keep this if App Router was chosen, otherwise can remove
  ],
  darkMode: "class", // Enable dark mode by toggling a 'dark' class on the html element
  theme: {
    extend: {
      // Define your custom dark mode colors if needed, e.g.:
      colors: {
        darkBg: "#121212",
        darkCard: "#1E1E1E",
        darkText: "#E0E0E0",
        darkAccent: "#BB86FC", // A sample accent color for dark mode
        // Add more dark mode specific colors here
      },
    },
  },
  plugins: [],
};

export default config;
