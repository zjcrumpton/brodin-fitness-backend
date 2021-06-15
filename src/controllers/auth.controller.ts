import { NextFunction, Request, Response } from 'express';
import { CreateUserDto, LoginUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import { RequestWithUser } from '@interfaces/auth.interface';
import AuthService from '@services/auth.service';
import AuthViews from '@/views/auth.views';

class AuthController {
  public authService = new AuthService();
  public authViews = new AuthViews();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const { token, user } = await this.authService.signup(userData);
      const view = this.authViews.auth(token, user);

      res.status(201).json(view);
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: LoginUserDto = req.body;
      const { token, user } = await this.authService.login(userData);
      const view = this.authViews.auth(token, user);

      res.status(200).json(view);
    } catch (error) {
      next(error);
    }
  };

  public authenticate = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user: User = req.user;
      const view = this.authViews.succes(user);
      res.status(200).json(view);
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
