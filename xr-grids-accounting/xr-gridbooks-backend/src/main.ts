import 'dotenv/config';
import express from 'express';
import { createApolloServer } from './presentation/graphql/server';
import { prisma } from './infrastructure/database/prisma/client';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
    const app = express();

    // Health check endpoint
    app.get('/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // Create Apollo Server
    const { httpServer } = await createApolloServer(app);

    // Start server
    httpServer.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
        console.log(`📊 Health check at http://localhost:${PORT}/health`);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
        console.log('\n🛑 Shutting down gracefully...');
        await prisma.$disconnect();
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        console.log('\n🛑 Shutting down gracefully...');
        await prisma.$disconnect();
        process.exit(0);
    });
}

bootstrap().catch((error) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
});
