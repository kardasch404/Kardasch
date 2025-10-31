import { server } from './app.js';
import config from './config/config.js';
import Database from './services/database.js';
import { startStandaloneServer } from '@apollo/server/standalone';
import JWTUtil from './utils/jwt.js';

const startServer = async () => {
    const db = Database.getInstance();
    await db.connect();
    
    const { url } = await startStandaloneServer(server, {
        listen: { port: config.port },
        context: async ({ req }) => {
            const token = req.headers.authorization?.split(' ')[1];
            if (token) {
                try {
                    const decoded = JWTUtil.verifyAccessToken(token);
                    console.log('Context:', { userId: decoded.userId, role: decoded.role });
                    return { userId: decoded.userId, role: decoded.role };
                } catch (error) {
                    console.log('Token verification error:', error);
                    return {};
                }
            }
            console.log('No token provided');
            return {};
        }
    });
    
    console.log(`Server running at ${url}`);
};

startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
