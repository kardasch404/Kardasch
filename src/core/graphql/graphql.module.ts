import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { DateScalar } from '../../graphql/scalars/date.scalar';
import { JSONScalar } from '../../graphql/scalars/json.scalar';
import { GraphQLError, GraphQLFormattedError } from 'graphql';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
        playground: configService.get('app.nodeEnv') !== 'production',
        introspection: configService.get('app.nodeEnv') !== 'production',
        context: ({ req, res }) => ({ req, res }),
        formatError: (error: GraphQLError): GraphQLFormattedError => {
          const isDev = configService.get('app.nodeEnv') === 'development';
          return {
            message: error.message,
            locations: error.locations,
            path: error.path,
            extensions: {
              code: error.extensions?.code,
              ...(isDev && { stacktrace: error.extensions?.stacktrace }),
            },
          };
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [DateScalar, JSONScalar],
  exports: [GraphQLModule],
})
export class GraphqlModule {}
