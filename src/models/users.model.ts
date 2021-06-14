import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { User } from '@interfaces/users.interface';

export type UserCreationAttributes = Optional<User, 'email' | 'username' | 'passwordDigest'>;

export class UserModel extends Model<User, UserCreationAttributes> implements User {
  public id: number;
  public username: string;
  public email: string;
  public passwordDigest: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof UserModel {
  UserModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      username: {
        type: DataTypes.STRING(20),
        unique: true,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING(45),
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      passwordDigest: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
    },
    {
      tableName: 'users',
      sequelize,
    },
  );

  return UserModel;
}
