import { Injectable, UnauthorizedException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SigninDto } from './dto/signin.dto';
import { ReturnSigninDto } from './dto/return-signin.dto';
import { UserService } from '../user/user.service';
import { PasswordService } from '../password/password.service';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PayloadUserDto } from 'src/user/dto/payload-user.dto';

// AuthService class that contains authentication logic
@Injectable()
export class AuthService {
  // Inject the Admin model and JwtService into the AuthService
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
  ) {}

  /* createJwtToken method that create jwt token with specific payload and time to expire
      Parameters:
        - payload: object
        - expiresIn: string
      Returns:
        - token: string
      Errors:
        - error
  */
  async createJwtToken(payload: object, expiresIn: string): Promise<string> {
    try {
      // create a jwt token with the payload and time to expire
      const token = await this.jwtService.signAsync(payload, { expiresIn });
      return token;
    } 
    catch (error) {
      throw error;
    }
  }

  /* verifyJwtToken method that verify jwt token
      Parameters:
        - token: string
      Returns:
        - payload: object
      Errors:
        - error
  */
  async verifyJwtToken(token: string): Promise<{ [key: string]: any; id: string }> {
    try {
      // verify the jwt token
      const payload = await this.jwtService.verifyAsync(token);
      return payload;
    } 
    catch (error) {
      throw error;
    }
  }

  /* signin method that takes in a SigninDto and return ReturnSigninDto object
      Parameters:
        - signinDto: SigninDto
      Returns:
        - object: ReturnSigninDto
      Errors:
        - UnauthorizedException: 'Invalid credentials'
  */
  async signin(signinDto: SigninDto): Promise<ReturnSigninDto> {
    try {
      // destructure email and password from signinDto
      const { email, password } = signinDto;
      // find user by email in the database
      const user = await this.userService.find('email', email);
      // check if password is valid and compare password with hashed password in the database
      const IsValidPassword = await this.passwordService.comparePassword(password, user.password);
      if (!IsValidPassword) {
        throw new UnauthorizedException('Invalid credentials');
      }
      // create a payload with user id, email
      const payload: PayloadUserDto = { id: user._id.toString(), email: user.email, name: user.name };
      // create access token with the payload
      const accessToken = await this.createJwtToken(payload as object, '1h');
      // create refresh token with the payload
      const refreshToken = await this.createJwtToken(payload, '7d');
      // update the refresh token in the database
      await this.userService.update(user._id.toString(), { refresh_token: refreshToken });
      // set the refresh token in the cache with key as user id and expire in 7 days
      await this.cacheManager.set(refreshToken, payload, 60 * 60 * 24 * 7);
      // return the access token and refresh token and message
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        message: 'Signin successful',
      }
    } 
    catch (error) {
      if (error instanceof UnauthorizedException || error instanceof NotFoundException) {
        throw new UnauthorizedException('Invalid credentials');
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  /* refresh method that takes in a refresh token and return ReturnSigninDto object
      Parameters:
        - refreshToken: string
      Returns:
        - object: ReturnSigninDto
      Errors:
        - UnauthorizedException: 'Invalid credentials'
  */
  async refresh(refreshToken: string): Promise<ReturnSigninDto> {
    try {
      if (!refreshToken) {
        throw new UnauthorizedException('Invalid credentials');
      }
      // get refersh token payload from the cache
      let payload: PayloadUserDto;
      payload = await this.cacheManager.get(refreshToken);
      // check if not found in the cache search in the database
      if (!payload) {
        const user = await this.userService.find('refresh_token', refreshToken);
        await this.verifyJwtToken(refreshToken);
        payload = { id: user._id.toString(), email: user.email, name: user.name };
        // check if refresh token is valid
        if (!payload) {
          throw new UnauthorizedException('Invalid credentials');
        }
      } else {
        // remove the refresh token from the cache
        await this.cacheManager.del(refreshToken);
      }
      // create new access token with the payload
      const accessToken = await this.createJwtToken(payload, '1h');
      // create new refresh token with the payload
      const newRefreshToken = await this.createJwtToken(payload, '7d');
      // update the refresh token in the database
      await this.userService.update(payload.id, { refresh_token: newRefreshToken });
      // set the refresh token in the cache with key as user id
      await this.cacheManager.set(newRefreshToken, payload, 60 * 60 * 24 * 7);
      // return the access token and refresh token and message
      return {
        access_token: accessToken,
        refresh_token: newRefreshToken,
        message: 'Refresh successful',
      }
    } 
    catch (error) {
      if (error instanceof UnauthorizedException || error instanceof NotFoundException) {
        throw new UnauthorizedException('Invalid credentials');
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  /* revoke method that takes in a refresh token and return message
      Parameters:
        - refreshToken: string
      Returns:
        - message: string
      Errors:
        - UnauthorizedException: 'Invalid credentials'
  */
  async revoke(refreshToken: string): Promise<{ message: string }> {
    try {
      // get refersh token payload from the cache
      let payload: PayloadUserDto = await this.cacheManager.get(refreshToken);
      // check if found in the cache remove from the cache
      if (payload) {
        await this.cacheManager.del(refreshToken);
      }
      const user = await this.userService.find('refresh_token', refreshToken);
      // remove the refresh token from the database
      await this.userService.update(user._id.toString(), { refresh_token: null });
      // return message
      return { message: 'Revoke successful', }
    } 
    catch (error) {
      if (error instanceof UnauthorizedException || error instanceof NotFoundException) {
        throw new UnauthorizedException('Not found refresh token');
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
