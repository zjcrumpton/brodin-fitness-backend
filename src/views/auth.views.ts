import { User } from '@/interfaces/users.interface';

export default class AuthViews {
  public auth(token: string, user: User) {
    return {
      status: 'success',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        token,
      },
    };
  }

  public succes(user: User) {
    return {
      status: 'success',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        message: 'succesfully authenticated',
      },
    };
  }
}
