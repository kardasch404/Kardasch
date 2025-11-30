import { Catch, ArgumentsHost } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch()
export class GraphqlExceptionFilter implements GqlExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    
    return new GraphQLError(exception.message || 'Internal server error', {
      extensions: {
        code: exception.code || 'INTERNAL_SERVER_ERROR',
        statusCode: exception.status || 500,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
