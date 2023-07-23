/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            fontFamily: {
                prime: ["'VT323'", "monospace"],
            }
        }
    },
    plugins: []
};