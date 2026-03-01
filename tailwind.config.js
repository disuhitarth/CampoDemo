/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            fontFamily: {
                mono: ['IBM Plex Mono', 'Courier New', 'monospace'],
            },
        },
    },
    plugins: [],
};
