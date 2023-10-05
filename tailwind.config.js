const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      gridTemplateRows: {
        "main-layout": "auto min-content",
      },
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateY(100%)",
          },
        },
      },
    },
  },
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
