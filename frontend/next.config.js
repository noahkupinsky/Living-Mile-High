const dotenv = require('dotenv');
const path = require('path');
const { withTamagui } = require('@tamagui/next-plugin');

const allowedEnvFiles = ['staging', 'development', 'production'];

const envFile = process.env.ENV_FILE;

if (envFile && allowedEnvFiles.includes(envFile)) {
    const envPath = path.resolve(__dirname, `../.env.${envFile}`);
    dotenv.config({ path: envPath });
}

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
        webpack: (config) => {
            config.resolve.alias = {
                ...(config.resolve.alias || {}),
                'react-native$': 'react-native-web',
            };
            return config;
        },
        async headers() {
            return [
                {
                    // Apply these headers to all routes in your application
                    source: '/:path*',
                    headers: [
                        {
                            key: 'Cross-Origin-Opener-Policy',
                            value: 'allow-popups',
                        },
                        {
                            key: 'Cross-Origin-Embedder-Policy',
                            value: 'unsafe-none',
                        }
                    ],
                },
            ];
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