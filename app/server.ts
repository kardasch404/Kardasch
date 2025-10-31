import { server } from './app.js';
import config from './config/config.js';
import Database from './services/database.js';
import { startStandaloneServer } from '@apollo/server/standalone';

const startServer = async () => {
    const db = Database.getInstance();
    await db.connect();
    
    const { url } = await startStandaloneServer(server, {
        listen: { port: config.port },
    });
    
    console.log(`Server running at ${url}`);
};

startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});