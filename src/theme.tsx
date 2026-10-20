import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
    initialColorMode: 'system',
    useSystemColorMode: false,
};

// Organic biophilic palette (ui-ux-pro-max): green.700 on white keeps text/buttons above 4.5:1
const LEAF_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cg fill='black'%3E%3Cpath transform='translate(28 46) rotate(-30)' d='M0 0C10-14 30-16 40-8C32 6 12 10 0 0Z'/%3E%3Cpath transform='translate(118 32) rotate(25)' d='M0 0C8-11 24-13 32-6C26 5 10 8 0 0Z'/%3E%3Cpath transform='translate(92 136) rotate(-60)' d='M0 0C12-16 34-18 46-9C36 7 14 11 0 0Z'/%3E%3Cpath transform='translate(22 142) rotate(40)' d='M0 0C6-8 18-9 24-4C19 4 7 6 0 0Z'/%3E%3Cpath transform='translate(150 104) rotate(-10)' d='M0 0C5-7 15-8 20-3C16 3 6 5 0 0Z'/%3E%3C/g%3E%3C/svg%3E")`;

const theme = extendTheme({
    config,
    fonts: {
        body: "'Nunito Sans', system-ui, sans-serif",
        heading: "'Varela Round', 'Nunito Sans', system-ui, sans-serif",
    },
    colors: {
        brand: {
            50: '#F0FDF4',
            100: '#DCFCE7',
            200: '#BBF7D0',
            300: '#86EFAC',
            400: '#4ADE80',
            500: '#22C55E',
            600: '#16A34A',
            700: '#15803D',
            800: '#166534',
            900: '#14532D',
        },
        accent: {
            500: '#D97706',
            600: '#B45309',
        },
    },
    // every component reads these names, so light and dark only differ here
    semanticTokens: {
        colors: {
            'bg.canvas': { default: 'brand.50', _dark: '#0E1712' },
            'bg.surface': { default: 'white', _dark: '#16231B' },
            'bg.subtle': { default: 'brand.50', _dark: '#1D2E24' },
            'bg.muted': { default: 'brand.100', _dark: '#25392D' },
            'bg.header': { default: 'rgba(255, 255, 255, 0.9)', _dark: 'rgba(22, 35, 27, 0.9)' },
            'bg.input': { default: 'white', _dark: '#101B15' },
            'border.subtle': { default: 'brand.100', _dark: 'whiteAlpha.200' },
            'border.input': { default: 'gray.300', _dark: 'whiteAlpha.300' },
            'text.primary': { default: 'gray.900', _dark: 'gray.50' },
            'text.secondary': { default: 'gray.700', _dark: 'gray.200' },
            'text.muted': { default: 'gray.600', _dark: 'gray.400' },
            'text.brand': { default: 'brand.800', _dark: 'brand.300' },
            'icon.placeholder': { default: 'brand.300', _dark: 'brand.700' },
            // background decoration: soft glows and a faint leaf pattern behind every page
            'bg.glow1': { default: 'rgba(134, 239, 172, 0.45)', _dark: 'rgba(21, 128, 61, 0.28)' },
            'bg.glow2': { default: 'rgba(253, 230, 138, 0.40)', _dark: 'rgba(217, 119, 6, 0.10)' },
            'bg.glow3': { default: 'rgba(110, 231, 183, 0.35)', _dark: 'rgba(16, 185, 129, 0.14)' },
            'bg.pattern': { default: 'rgba(21, 128, 61, 0.06)', _dark: 'rgba(134, 239, 172, 0.045)' },
        },
    },
    styles: {
        global: {
            body: {
                bg: 'bg.canvas',
                color: 'text.primary',
            },
            // fixed layers behind the content: they never scroll and cost no layout
            'body::before, body::after': {
                content: '""',
                position: 'fixed',
                inset: 0,
                zIndex: -1,
                pointerEvents: 'none',
            },
            'body::before': {
                backgroundImage: [
                    'radial-gradient(38rem 38rem at 8% 4%, var(--chakra-colors-bg-glow1), transparent 70%)',
                    'radial-gradient(32rem 32rem at 96% 18%, var(--chakra-colors-bg-glow2), transparent 70%)',
                    'radial-gradient(44rem 44rem at 72% 104%, var(--chakra-colors-bg-glow3), transparent 70%)',
                    'radial-gradient(26rem 26rem at 18% 88%, var(--chakra-colors-bg-glow2), transparent 70%)',
                ].join(', '),
                // opacity only: a transform would grow the layer past the viewport and add scrollbars
                animation: 'canvasBreath 14s ease-in-out infinite alternate',
            },
            'body::after': {
                backgroundColor: 'bg.pattern',
                maskImage: LEAF_PATTERN,
                WebkitMaskImage: LEAF_PATTERN,
                maskSize: '180px 180px',
                WebkitMaskSize: '180px 180px',
            },
            '@keyframes canvasBreath': {
                from: { opacity: 0.7 },
                to: { opacity: 1 },
            },
            '@media (prefers-reduced-motion: reduce)': {
                'body::before': { animation: 'none' },
            },
        },
    },
    radii: {
        card: '1.25rem',
    },
    shadows: {
        card: '0 1px 2px rgba(20, 83, 45, 0.06), 0 4px 16px rgba(20, 83, 45, 0.06)',
        cardHover: '0 2px 4px rgba(20, 83, 45, 0.08), 0 12px 28px rgba(20, 83, 45, 0.12)',
    },
    components: {
        Button: {
            baseStyle: { borderRadius: 'xl', fontWeight: 'semibold' },
            variants: {
                solid: (props: { colorScheme: string }) =>
                    props.colorScheme === 'brand' || props.colorScheme === 'green'
                        ? {
                            bg: 'brand.700',
                            color: 'white',
                            _hover: { bg: 'brand.800', _disabled: { bg: 'brand.700' } },
                            _active: { bg: 'brand.900' },
                        }
                        : {},
            },
            defaultProps: { colorScheme: 'brand' },
        },
        Input: {
            defaultProps: { focusBorderColor: 'brand.600' },
            variants: { outline: { field: { bg: 'bg.input', borderRadius: 'xl', borderColor: 'border.input' } } },
        },
        Textarea: {
            defaultProps: { focusBorderColor: 'brand.600' },
            variants: { outline: { bg: 'bg.input', borderRadius: 'xl', borderColor: 'border.input' } },
        },
        Select: {
            defaultProps: { focusBorderColor: 'brand.600' },
            variants: { outline: { field: { bg: 'bg.input', borderRadius: 'xl', borderColor: 'border.input' } } },
        },
        Switch: { defaultProps: { colorScheme: 'brand' } },
        Checkbox: { defaultProps: { colorScheme: 'brand' } },
        Tabs: { defaultProps: { colorScheme: 'brand' } },
        Card: {
            baseStyle: { container: { borderRadius: 'card', boxShadow: 'card', bg: 'bg.surface', borderWidth: '1px', borderColor: 'border.subtle' } },
        },
        Modal: {
            baseStyle: { dialog: { borderRadius: 'card', bg: 'bg.surface' } },
        },
        Heading: {
            baseStyle: { color: 'text.primary', fontWeight: 'normal' },
        },
    },
});

export default theme;
