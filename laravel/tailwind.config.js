import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/**/*.blade.php',
        './resources/**/*.js',
        './resources/**/*.vue',
        './vendor/filament/**/*.blade.php',
    ],
    theme: {
        extend: {
            colors: {
                'dark-carbon': '#1D1D1D',
                parchment: '#F4F1EA',
                'metallic-gold': '#D4AF37',
                'ruby-red': '#9B1B30',
            },
            boxShadow: {
                'cel-8': '8px 8px 0px 0px #000000',
                'cel-12': '12px 12px 0px 0px #000000',
            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [],
};
