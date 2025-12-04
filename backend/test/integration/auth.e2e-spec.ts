import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Authentication Flow (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Registration', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              register(input: {
                email: "test@example.com"
                username: "testuser"
                password: "SecurePass123!"
                firstName: "Test"
                lastName: "User"
              }) {
                accessToken
                user { id username email }
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.register).toBeDefined();
          expect(res.body.data.register.accessToken).toBeDefined();
          accessToken = res.body.data.register.accessToken;
        });
    });

    it('should reject weak password', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              register(input: {
                email: "weak@example.com"
                username: "weakuser"
                password: "123"
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
  });

  describe('Login', () => {
    it('should login with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              login(input: {
                identifier: "test@example.com"
                password: "SecurePass123!"
              }) {
                accessToken
                user { id username email role }
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.login).toBeDefined();
          accessToken = res.body.data.login.accessToken;
        });
    });

    it('should reject invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              login(input: {
                identifier: "test@example.com"
                password: "WrongPassword"
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
  });

  describe('Logout', () => {
    it('should logout successfully', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          query: `mutation { logout }`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.logout).toBe(true);
        });
    });
  });
});
