import { Body, Controller, Post, Res, Param, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { SigninDto } from './dto/signin.dto';
import { ReturnSigninDto } from './dto/return-signin.dto';
import { ApiErrorResponses } from '../common/decorators/api-error-response.decorator';

/* AuthController class that contains routes for authentication
    Routes:
      - POST /auth/login/:type - login and set token in cookie
*/
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  // Define cookies object configuration
  private readonly cookieConfig: object;
  // Inject the AuthService to the AuthController
  constructor(private readonly authService: AuthService) {
    // Set the cookie configuration
    this.cookieConfig = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // set secure to true in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // set sameSite to none in production
    };
  }

  // POST /auth/signin - signin and set token in cookie
  @Post('signin')
  @ApiOperation({ summary: 'Signin for the user' })
  @ApiResponse({ status: 200, description: 'Signin successfully', type: ReturnSigninDto })
  @ApiErrorResponses([400, 401, 500]) // Add error responses to the Swagger documentation
  async signin(@Body() signinDto: SigninDto, @Res() res: Response) : Promise<Response> {
    const returnSigninDto = await this.authService.signin(signinDto);
    // set token in cookie
    res.cookie('token', returnSigninDto.refresh_token, this.cookieConfig);
    return res.status(200).json(returnSigninDto);
  }

  // POST /auth/refresh-token - refresh token
  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh token for the user' })
  @ApiResponse({ status: 200, description: 'Refresh token successfully', type: ReturnSigninDto })
  @ApiErrorResponses([400, 401, 500]) // Add error responses to the Swagger documentation
  async refreshToken(@Req() req: any, @Res() res: Response) : Promise<Response> {
    // get refresh token from cookie
    const refreshToken = req.cookies['token'];
    const returnSigninDto = await this.authService.refresh(refreshToken);
    // set token in cookie
    res.cookie('token', returnSigninDto.refresh_token, this.cookieConfig);
    return res.status(200).json(returnSigninDto);
  }

  // POST /auth/signout - signout and clear token in cookie
  @Post('signout')
  @ApiOperation({ summary: 'Signout for the user' })
  @ApiResponse({ status: 200, description: 'Signout successfully' })
  @ApiErrorResponses([400, 401, 500]) // Add error responses to the Swagger documentation
  async signout(@Res() res: Response, @Req() req: any) : Promise<Response> {
    // get refresh token from cookie
    const refreshToken = req.cookies['token'];
    await this.authService.revoke(refreshToken);
    // clear token in cookie
    res.clearCookie('token', this.cookieConfig);
    return res.status(200).json({ message: 'Signout successfully' });
  }
}
