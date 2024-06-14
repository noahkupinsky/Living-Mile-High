const dotenv = require('dotenv');
const path = require('path');

const envFile = path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`);

dotenv.config({ path: envFile });

const API_PORT = process.env.API_PORT || 3001;

module.exports = {
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
}
