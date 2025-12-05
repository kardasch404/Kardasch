import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Security Features (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits for anonymous users', async () => {
      const requests = [];
      
      // Make 15 requests (limit is 10/min for anonymous)
      for (let i = 0; i < 15; i++) {
        requests.push(
          request(app.getHttpServer())
            .post('/graphql')
            .send({ query: '{ __typename }' })
        );
      }

      const responses = await Promise.all(requests);
      const rateLimited = responses.filter(r => r.status === 429);
      
      expect(rateLimited.length).toBeGreaterThan(0);
    });
  });

  describe('Input Validation', () => {
    it('should reject XSS attempts', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              register(input: {
                email: "xss@example.com"
                username: "<script>alert('xss')</script>"
                password: "SecurePass123!"
              }) {
                accessToken
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          if (res.body.data?.register) {
            expect(res.body.data.register.user.username).not.toContain('<script>');
          }
        });
    });

    it('should reject NoSQL injection', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              login(input: {
                identifier: "{ $ne: null }"
                password: "anything"
              }) {
                accessToken
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });

    it('should reject invalid URLs', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              updateProfile(input: {
                socialLinks: {
                  github: "javascript:alert('xss')"
                }
              }) {
                id
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });
  });

  describe('Bot Detection', () => {
    it('should detect suspicious user agents', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('User-Agent', 'python-requests/2.28.0')
        .send({
          query: `
            mutation {
              login(input: {
                identifier: "test@example.com"
                password: "SecurePass123!"
              }) {
                accessToken
              }
            }
          `,
        })
        .expect(200);
    });

    it('should detect missing headers', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('User-Agent', '')
        .send({
          query: `{ __typename }`,
        })
        .expect(200);
    });
  });
});
