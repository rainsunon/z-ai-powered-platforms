import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { readFileSync } from 'fs';
import { join } from 'path';
import { GraphQLScalarType, Kind } from 'graphql';
import { createContext } from './context';
import { clientResolvers } from './resolvers/client.resolver';
import { invoiceResolvers } from './resolvers/invoice.resolver';
import { authResolvers } from './resolvers/auth.resolver';

// Custom scalar for DateTime
const dateTimeScalar = new GraphQLScalarType({
    name: 'DateTime',
    description: 'DateTime custom scalar type',
    serialize(value: any) {
        return value instanceof Date ? value.toISOString() : value;
    },
    parseValue(value: any) {
        return new Date(value);
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return new Date(ast.value);
        }
        return null;
    },
});

// Custom scalar for JSON
const jsonScalar = new GraphQLScalarType({
    name: 'JSON',
    description: 'JSON custom scalar type',
    serialize(value: any) {
        return value;
    },
    parseValue(value: any) {
        return value;
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.OBJECT) {
            return ast;
        }
        return null;
    },
});

// Load GraphQL schemas
const authTypeDefs = readFileSync(
    join(__dirname, 'schema', 'auth.graphql'),
    'utf-8'
);
const clientTypeDefs = readFileSync(
    join(__dirname, 'schema', 'client.graphql'),
    'utf-8'
);
const invoiceTypeDefs = readFileSync(
    join(__dirname, 'schema', 'invoice.graphql'),
    'utf-8'
);

// Combine type definitions
const typeDefs = [authTypeDefs, clientTypeDefs, invoiceTypeDefs];

// Combine resolvers
const resolvers = {
    DateTime: dateTimeScalar,
    JSON: jsonScalar,
    Query: {
        ...authResolvers.Query,
        ...clientResolvers.Query,
        ...invoiceResolvers.Query,
    },
    Mutation: {
        ...authResolvers.Mutation,
        ...clientResolvers.Mutation,
        ...invoiceResolvers.Mutation,
    },
    Invoice: invoiceResolvers.Invoice,
};

export async function createApolloServer(app: express.Application) {
    const httpServer = http.createServer(app);

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();

    app.use(
        '/graphql',
        cors<cors.CorsRequest>({
            origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
            credentials: true,
        }),
        express.json(),
        expressMiddleware(server, {
            context: createContext,
        })
    );

    return { server, httpServer };
}
