import { 
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// This service is responsible for hashing passwords and comparing them.
@Injectable()
export class PasswordService {
  constructor() {}

  /* hashPassword is a method that takes a password and hashes it using bcrypt.
      Parameters:
      - password: string
      Returns:
        - hashed password: string
  */
  async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      throw new Error(error);
    }
  }

  /* comparePassword is a method that takes a password and a hashed password and compares them.
      Parameters:
      - password: string
      - hashedPassword: string
      Returns:
        - boolean
  */
  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error(error);
    }
  }
}
