/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "var(--primary)",
                "primary-light": "var(--primary-light)",
                secondary: "var(--secondary)",
                accent: "var(--accent)",
                background: "var(--background)",
                foreground: "var(--foreground)",
                surface: "var(--surface)",
                "surface-dark": "var(--surface-dark)",
                card: "var(--card)",
                divider: "var(--divider)",
                neutral: {
                    50: "var(--neutral-50)",
                    100: "var(--neutral-100)",
                    200: "var(--neutral-200)",
                    300: "var(--neutral-300)",
                    600: "var(--neutral-600)",
                    800: "var(--neutral-800)",
                },
            },
            fontFamily: {
                sans: ["var(--font-geist-sans)"],
                mono: ["var(--font-geist-mono)"],
            },
            boxShadow: {
                soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
                card: "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)",
                elevated: "0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            },
            borderRadius: {
                '4xl': '2rem',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
            ringColor: {
                DEFAULT: "var(--primary)",
                primary: "var(--primary)",
                secondary: "var(--secondary)",
                accent: "var(--accent)",
            },
            ringOffsetColor: {
                DEFAULT: "var(--background)",
                background: "var(--background)",
            },
        },
    },
    plugins: [],
} 