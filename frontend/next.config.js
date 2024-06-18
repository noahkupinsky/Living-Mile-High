const dotenv = require('dotenv');
const path = require('path');
const { withTamagui } = require('@tamagui/next-plugin');

const envFile = path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`);
dotenv.config({ path: envFile });

const plugins = [
    withTamagui({
        config: 'src/config/tamagui.config.ts',
        components: ['tamagui'],
        appDir: true,
    }),
]

module.exports = function () {
    /** @type {import('next').NextConfig} */
    let config = {
        swcMinify: true,
        async rewrites() {
            if (process.env.NODE_ENV === 'development') { // Proxy to Backend in Development
                return [
                    {
                        source: '/api/:path*',
                        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
                    },
                ];
            }
            return [];
        },
        webpack: (config) => {
            config.resolve.alias = {
                ...(config.resolve.alias || {}),
                'react-native$': 'react-native-web',
            };
            return config;
        },
    }

    for (const plugin of plugins) {
        config = {
            ...config,
            ...plugin(config),
        }
    }

    return config
}