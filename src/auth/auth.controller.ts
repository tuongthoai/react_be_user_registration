import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { UserSignInApiRequest } from './dto/UserSignInApiRequest';
import { UserSignUpApiRequest } from './dto/UserSignUpApiRequest';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('/user/login')
  async signIn(
    @Body() userSignInApiRequest: UserSignInApiRequest,
  ): Promise<{ access_token: string }> {
    return this.authService.signIn(
      userSignInApiRequest.username,
      userSignInApiRequest.password,
    );
  }

  @Post('/user/register')
  async register(
    @Body() userDto: UserSignUpApiRequest,
  ): Promise<{ token: string }> {
    const user = await this.userService.register(userDto);
    const token = await this.authService.generateJwt(user);
    return { token };
  }
}
