import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/model/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string; username: string }> {
    const user = await this.usersService.findOne(username);
    // Usage in your login logic
    const isPasswordValid = await this.verifyPassword(pass, user.password);
    console.log('comp result: ', isPasswordValid);

    if (isPasswordValid) {
      // Proceed with authentication (e.g., generate JWT)
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
      username: user.username,
    };
  }

  async generateJwt(user: User): Promise<string> {
    // Use a unique field like `user.id` or `user.username`
    const payload = { sub: user.id, username: user.username };
    return this.jwtService.sign(payload);
  }
}
