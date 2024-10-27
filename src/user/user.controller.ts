import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponses } from '../common/decorators/api-error-response.decorator';

// UserController class that contains routes for user
@ApiTags('User')
@Controller('user')
export class UserController {
  // Inject the UserService to the UserController
  constructor(
    private readonly userService: UserService,
  ) {}

  // POST /auth/signup - signup
  @Post('signup')
  @ApiOperation({ summary: 'Signup for the user' })
  @ApiResponse({ status: 200, description: 'Signed up successfully' })
  @ApiErrorResponses([400, 409, 500]) // Custom decorator for error responses
  async signup(@Body() createUserDto: CreateUserDto) : Promise<{ message: string }> {
    return await this.userService.create(createUserDto);
  }
}
