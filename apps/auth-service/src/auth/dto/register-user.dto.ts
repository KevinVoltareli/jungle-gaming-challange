import { IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  username!: string;

  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}
