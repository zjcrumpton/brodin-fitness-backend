import bcrypt from 'bcrypt';
import config from 'config';
import jwt from 'jsonwebtoken';
import DB from '@databases';
import { CreateUserDto, LoginUserDto } from '@dtos/users.dto';
import HttpException from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';

class AuthService {
  public users = DB.Users;

  public async signup(userData: CreateUserDto): Promise<{ user: User; token: string }> {
    if (isEmpty(userData)) throw new HttpException(400, 'please provide an email, username, and password to signup');

    const findUser: User = await this.users.findOne({
      where: {
        [DB.Sequelize.Op.or]: [{ email: userData.email }, { username: userData.username }],
      },
    });

    if (findUser) {
      const errorMsg = findUser.email === userData.email ? ['email address', userData.email] : ['username', userData.username];

      throw new HttpException(409, `A user with the ${errorMsg[0]}: ${errorMsg[1]} already exists`);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createUserData: User = await this.users.create({ ...userData, passwordDigest: hashedPassword });

    const tokenData = this.createToken(createUserData);

    return { user: createUserData, token: tokenData.token };
  }

  public async login(userData: LoginUserDto): Promise<{ user: User; token: string }> {
    if (isEmpty(userData)) throw new HttpException(400, 'please provide an email and password to login');

    const findUser: User = await this.users.findOne({ where: { email: userData.email } });
    if (!findUser) throw new HttpException(409, `can't find a user with the provided email address: ${userData.email}`);

    const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.passwordDigest);
    if (!isPasswordMatching) throw new HttpException(409, 'wrong password');

    const tokenData = this.createToken(findUser);

    return { user: findUser, token: tokenData.token };
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secretKey: string = config.get('secretKey');
    // One week in milliseconds
    const expiresIn: number = 604800000;

    return { expiresIn, token: jwt.sign(dataStoredInToken, secretKey, { expiresIn }) };
  }
}

export default AuthService;
