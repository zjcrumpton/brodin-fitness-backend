import { IsString, IsEmail, Length, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 12)
  public password: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  public username: string;
}

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 12)
  public password: string;
}
