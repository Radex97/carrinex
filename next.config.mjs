import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Ignoriere ESLint-Fehler während des Builds
        ignoreDuringBuilds: true,
    },
    typescript: {
        // Optional: Ignoriere TypeScript-Fehler während des Builds
        ignoreBuildErrors: true,
    },
};

export default withNextIntl(nextConfig);
