import { CreateUserDto } from '../../user/dto/create-user.dto';
import { OmitType } from '@nestjs/swagger';

// LoginDto that extends OmitType CreateUserDto to exclude the name field
export class SigninDto extends OmitType(CreateUserDto, ['name']) {}
