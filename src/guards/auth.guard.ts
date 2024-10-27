import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';

// JwtAuthGuard class that protects routes with JWT authentication
@Injectable()
export class AuthGuard implements CanActivate {
  // Inject JwtService and Reflector
  constructor(
    private readonly authService: AuthService,
  ) {}

  /* canActivate method that checks if the request contains a valid JWT token
      and attaches the user info to the request object 
      Parameters:
        - context: ExecutionContext object that contains the request object
      Returns:
        - boolean: true if the token is valid, false otherwise
      Errors:
        - UnauthorizedException: if the token is missing or invalid
  */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get the request object from the context
    const request: Request = context.switchToHttp().getRequest();
    // Get the token from the request authorization header
    const token = request.headers['authorization']?.split(' ')[1];
    // If no token is found, throw an error
    if (!token) {
      throw new UnauthorizedException('Please login to access this resource');
    }

    try {
      // Verify the token and get the payload data and if the token is invalid, throw an error
      const payload = await this.authService.verifyJwtToken(token);
      if (!payload) {
        throw new UnauthorizedException("Failed to authenticate token");
      }
      // Attach the user info to the request object
      request['user'] = payload;
      return true;
    } catch (error) {
      throw error;
    }
  }
}