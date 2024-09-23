export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}"
    ],
    theme: {
        extend: {
            backgroundImage: {
                "warmth": "conic-gradient(from 0deg, var(--color-anger) 0%, var(--color-sadness) 16.7%, var(--color-surprise) 33.3%, var(--color-joy) 50%, var(--color-love) 66.7%, var(--color-fear) 83.3%, var(--color-anger) 100%)"
            },
            fontSize: {
                "2xs": "0.625rem",
            },
            spacing: {
                "5.5": "1.375rem",
                "18": "4.5rem",
                "136": "34rem",
                "160": "40rem"
            }
        }
    },
    plugins: []
} satisfies import("tailwindcss").Config;