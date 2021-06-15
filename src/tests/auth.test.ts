import supertest from 'supertest';
import App from '@/app';
import AuthRoute from '@routes/auth.route';
import DB from '@databases';

const request = supertest(new App([new AuthRoute()]).getServer());

beforeAll(async () => {
  await DB.Users.destroy({
    where: {},
    truncate: true,
  });
});

describe('Authentication Routes', () => {
  describe('[POST] /api/auth/signup', () => {
    it('creates a user given a valid email, username, and password', async () => {
      const res = await request.post('/api/auth/signup').send({
        email: 'john@example.com',
        username: 'coolUser123',
        password: 'aReallyGoodPassword123!',
      });

      expect(res.status).toEqual(201);
    });

    it('does not allow duplicate usernames', async () => {
      await request.post('/api/auth/signup').send({
        email: 'notBob@example.com',
        username: 'coolUser123',
        password: 'aReallyGREATPassword321!',
      });

      const res = await request.post('/api/auth/signup').send({
        email: 'bob@example.com',
        username: 'coolUser123',
        password: 'aReallyGREATPassword321!',
      });

      expect(res.status).toEqual(409);
    });

    it('does not allow duplicate usernames', async () => {
      await request.post('/api/auth/signup').send({
        email: 'alex@example.com',
        username: 'uniqueName12',
        password: 'aReallyGREATPassword321!',
      });

      const res = await request.post('/api/auth/signup').send({
        email: 'alex@example.com',
        username: 'anotherUnique',
        password: 'superSecure123!',
      });

      expect(res.status).toEqual(409);
    });

    it('requires a password to be at least 6 characters long', async () => {
      const res = await request.post('/api/auth/signup').send({
        email: 'jesus@example.com',
        username: 'sonofgod',
        password: '12345',
      });

      expect(res.status).toEqual(400);
    });

    it('requires username to be at least 3 characters long', async () => {
      const res = await request.post('/api/auth/signup').send({
        email: 'mary@holy.com',
        username: 'ma',
        password: '123456',
      });

      expect(res.status).toEqual(400);
    });
  });

  describe('[POST] /api/auth/login', () => {
    it('logs the user in when given valid credentials', async () => {
      await request.post('/api/auth/signup').send({
        email: 'joseph@holy.com',
        username: 'bigjoe',
        password: '123456',
      });

      const res = await request.post('/api/auth/login').send({
        email: 'joseph@holy.com',
        password: '123456',
      });

      expect(res.status).toEqual(200);
    });

    it('return UNAUTHORIZED when given invalid credentials', async () => {
      const res = await request.post('/api/auth/login').send({
        email: 'fakeemail@gmail.com',
        password: '123456',
      });

      expect(res.status).toEqual(401);

      await request.post('/api/auth/signup').send({
        email: 'fakeemail@gmail.com',
        password: '123456',
      });

      const resTwo = await request.post('/api/auth/login').send({
        email: 'fakeemail@gmail.com',
        password: '000000',
      });

      expect(resTwo.status).toEqual(401);
    });
  });
});
