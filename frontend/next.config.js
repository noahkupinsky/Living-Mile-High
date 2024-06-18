const dotenv = require('dotenv');
const path = require('path');
const { withTamagui } = require('@tamagui/next-plugin');

const envFile = path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`);
dotenv.config({ path: envFile });

const API_PORT = process.env.API_PORT || 3001;

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
                        destination: `http://localhost:${API_PORT}/api/:path*`,
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