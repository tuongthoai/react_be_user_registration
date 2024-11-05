import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/model/user.model';
import * as bcrypt from 'bcrypt';
import { UserSignUpApiRequest } from 'src/auth/dto/UserSignUpApiRequest';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ where: { username } });
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async register(userDto: UserSignUpApiRequest): Promise<User> {
    console.log(userDto);
    const hashedPassword = await bcrypt.hash(userDto.password, 10); // Hash the password
    console.log(hashedPassword);

    const newUser = await this.userModel.create({
      ...userDto,
      password: hashedPassword, // Store the hashed password
    });

    return newUser;
  }
}
