import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schema/user.schema';
import { Model, ClientSession } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PasswordService } from 'src/password/password.service';

// This is the service that will be used to interact with user data in the database.
@Injectable()
export class UserService {
  // The constructor will inject the User model into the service.
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly passwordService: PasswordService,
  ) {}

  /* create is method that will be used to create a new user in the database.
    It takes a CreateUserDto object as an argument and returns a Promise that resolves to a User object
    Parameters:
      - createUserDto: CreateUserDto - The data to create the user with
      - session: ClientSession - The session to use for the transaction
    Returns:
      - message: string - A message indicating that the user was created successfully
    Errors:
      - ConflictException: If the user already exists
      - InternalServerErrorException: If there was an error creating the user
  */
  async create(createUserDto: CreateUserDto, session: ClientSession = null): Promise<{ message: string }> {
    try {
      // get the password from the CreateUserDto object and hash it
      const hashedPassword = await this.passwordService.hashPassword(
        createUserDto.password,
      );
      // create a new user object with the hashed password
      const createUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });
      // create the user in the database with optinal session}
      const createdUser = await this.userModel.create([createUser], { session });
      return { message: 'User created successfully' };
    } catch (error) {
      // if the error is a duplicate key error, throw a ConflictException
      if (error.code === 11000) {
        throw new ConflictException('User already exists');
      }
      // otherwise, throw an InternalServerErrorException
      throw new InternalServerErrorException('Error creating user');
    }
  }

  /* find is a method that will be used to find a user in the database by their field.
    It takes an field as an argument and returns a Promise that resolves to a User object
    Parameters:
      - key: string - The field to search by
      - value: string - The value to search for
    Returns:
      - user: the user that was found
    Errors:
      - InternalServerErrorException: If there was an error finding the user
      - NotFoundException: If the user was not found
  */
  async find(key: string, value: string): Promise<UserDocument> {
    try {
      // find the user in the database by their field
      const user = await this.userModel.findOne({ [key]: value });
      // if the user was not found, throw a NotFoundException
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // otherwise, throw an InternalServerErrorException
      throw new InternalServerErrorException('Error finding user');
    }
  }

  /* update is a method that will be used to update a user in the database.
    It takes a user id and a partial User object as arguments and returns a Promise that resolves to a User object
    Parameters:
      - id: string - The id of the user to update
      - updateUser: Partial<User> - The data to update the user with
      - session: ClientSession - The session to use for the transaction
    Returns:
      - user: the user that was updated
    Errors:
      - InternalServerErrorException: If there was an error updating the user
      - NotFoundException: If the user was not found
  */
  async update(id: string, updateUser: Partial<User>, session: ClientSession = null): Promise<User> {
    try {
      // find the user in the database by their id and update it with the new data
      const user = await this.userModel.findByIdAndUpdate(id, updateUser, { new: true, session });
      // if the user was not found, throw a NotFoundException
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // otherwise, throw an InternalServerErrorException
      throw new InternalServerErrorException('Error updating user');
    }
  }
}
