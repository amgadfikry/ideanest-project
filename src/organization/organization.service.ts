import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationDocument, Organization } from './schema/organization.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession } from 'mongoose';
import { OrganizationMemberDto } from './dto/organization-member.dto';
import { PayloadUserDto } from '../user/dto/payload-user.dto';
import { UserService } from '../user/user.service';
import { InviteUserDto } from './dto/invite-user.dto';

// OrganizationService class that contains organization logic and interacts with the database
@Injectable()
export class OrganizationService {
  // inject organization model into the service
  constructor(
    @InjectModel(Organization.name) private organizationModel: Model<OrganizationDocument>,
    private readonly userService: UserService,
  ) {}

  /* check if the user is an admin of the organization
    Parameters:
      - id: string - The id of the organization to check
      - user: PayloadUserDto - The user to check
    Returns:
      - boolean: true if the user is an admin of the organization, false otherwise
  */
  async isUserAdmin(id: string, user: PayloadUserDto): Promise<boolean> {
    try {
      // find the organization in the database by id
      const organization = await this.organizationModel.findById(id);
      // if the organization was not found, throw a NotFoundError
      if (!organization) {
        throw new NotFoundException('Organization not found');
      }
      // find the user in the organization members array and check if the user is an admin
      const userIsAdmin = organization.organization_members.find(
        member => member.email === user.email && member.access_level === 'admin'
      );
      // return true if the user is an admin, false otherwise
      return userIsAdmin ? true : false;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // throw an error if there was an error checking if the user is an admin
      throw new InternalServerErrorException('Error checking if user is admin');
    }
  }

  /* create is method that will be used to create a new organization in the database.
    It takes a CreateOrganizationDto object as an argument and returns a Promise that resolves to a Organization object
    and add created user to the member array
    Parameters:
      - createOrganizationDto: CreateOrganizationDto - The data to create the organization with
      - user: User - The user that created the organization
      - session: ClientSession - The session to use for the transaction
    Returns:
      - creeated organization: Organization - The organization that was created
    Errors:
      - InternalServerErrorException: If there was an error creating the organization
  */
  async create(createOrganizationDto: CreateOrganizationDto, user: PayloadUserDto, session: ClientSession = null): Promise<Organization> {
    try {
      // create a new organization member object
      const organizationMember: OrganizationMemberDto = { email: user.email, name: user.name, access_level: 'admin' };
      // add the organization member to the organization members array 
      const organizationData = { ...createOrganizationDto, organization_members: [organizationMember] };
      // create a new organization in the database
      const newOrganization = await this.organizationModel.create([organizationData], { session });
      // return the created organization
      return newOrganization[0];
    } catch (error) {
      // throw an error if there was an error creating the organization
      throw new InternalServerErrorException('Error creating organization');
    }
  }

  /* findAll is a method that will be used to get all organizations from the database.
    It takes no arguments and returns a Promise that resolves to an array of Organization objects
    Returns:
      - organizations: Organization[] - An array of organizations
  */
  async findAll(): Promise<Organization[]> {
    try {
      // find all organizations in the database
      const organizations = await this.organizationModel.find();
      // return the organizations
      return organizations;
    } catch (error) {
      // throw an error if there was an error getting the organizations
      throw new InternalServerErrorException('Error getting organizations');
    }
  }

  /* findOne is a method that will be used to get an organization by id from the database.
    It takes an id as an argument and returns a Promise that resolves to an Organization object
    Parameters:
      - id: string - The id of the organization to get
    Returns:
      - organization: Organization - The organization with the specified id
    Errors:
      - NotFoundError: If the organization with the specified id was not found
      - InternalServerErrorException: If there was an error getting the organization
  */
  async findOne(id: string): Promise<Organization> {
    try{
      // find the organization in the database by id
      const organization = await this.organizationModel.findById(id);
      // if the organization was not found, throw a NotFoundError
      if (!organization) {
        throw new NotFoundException('Organization not found');
      }
      // return the organization
      return organization;
    } catch (error) {
      if ( error instanceof NotFoundException) {
        throw error;
      }
      // throw an error if there was an error getting the organization
      throw new InternalServerErrorException('Error getting organization');
    }
  }

  /* update is a method that will be used to update an organization in the database.
    It takes an id and an UpdateOrganizationDto object as arguments and returns a Promise that resolves to an Organization object
    Parameters:
      - id: string - The id of the organization to update
      - updateOrganizationDto: UpdateOrganizationDto - The data to update the organization with
    Returns:
      - updated organization: Organization - The organization that was updated
    Errors:
      - NotFoundError: If the organization with the specified id was not found
      - UnauthorizedError: If the user does not have permission to update the organization
      - InternalServerErrorException: If there was an error updating the organization
  */
  async update(
      id: string, updateOrganizationDto: UpdateOrganizationDto,
      user: PayloadUserDto, session: ClientSession = null
    ): Promise<Organization> {
    try {
      // check if the user is an admin of the organization
      const userIsAdmin = await this.isUserAdmin(id, user);
      // if the user is not an admin, throw an UnauthorizedException
      if (!userIsAdmin) {
        throw new UnauthorizedException('You are not an admin of the organization');
      }
      // update the organization with the new data
      const updatedOrganization = await this.organizationModel.findByIdAndUpdate(id, updateOrganizationDto, { new: true, session });
      // return the updated organization
      return updatedOrganization;
    } catch (error) {
      // if the organization NotFoundException, UnauthorizedException throw error
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      // throw an error if there was an error updating the organization
      throw new InternalServerErrorException('Error updating organization');
    }
  }

  /* remove is a method that will be used to remove an organization from the database.
    It takes an id as an argument and returns a Promise that resolves to a message object
    Parameters:
      - id: string - The id of the organization to remove
      - user: PayloadUserDto - The user that is removing the organization
    Returns:
      - message: string - A message indicating that the organization was removed
    Errors:
      - NotFoundError: If the organization with the specified id was not found
      - UnauthorizedError: If the user does not have permission to remove the organization
      - InternalServerErrorException: If there was an error removing the organization
  */
  async remove(id: string, user: PayloadUserDto, session: ClientSession = null): Promise<{ message: string }> {
    try {
      // check if the user is an admin of the organization
      const userIsAdmin = await this.isUserAdmin(id, user);
      // if the user is not an admin, throw an UnauthorizedException
      if (!userIsAdmin) {
        throw new UnauthorizedException('You are not an admin of the organization');
      }
      // remove the organization from the database
      await this.organizationModel.findByIdAndDelete(id, { session });
      // return the organization that was removed
      return { message: 'Organization removed' };
    } catch (error) {
      // if the organization NotFoundException, UnauthorizedException throw error
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      // throw an error if there was an error removing the organization
      throw new InternalServerErrorException('Error removing organization');
    }
  }

  /* addMember is a method that will be used to add a member to an organization in the database.
    It takes an id and an OrganizationMemberDto object as arguments and returns a Promise that resolves to an Organization object
    Parameters:
      - id: string - The id of the organization to add the member to
      - email: string - The email of the user to add as a member
      - user: PayloadUserDto - The user that is adding the member
      - session: ClientSession - The session to use for the transaction
    Returns:
      - updated organization: Organization - The organization with the new member added
    Errors:
      - NotFoundError: If the organization with the specified id was not found
      - InternalServerErrorException: If there was an error adding the member to the organization
  */
  async addMember(
      id: string, inviteUserDto: InviteUserDto, admin: PayloadUserDto, session: ClientSession = null): Promise<{ message: string }> {
    try {
      // check if the user is an admin of the organization
      const userIsAdmin = await this.isUserAdmin(id, admin);
      // if the user is not an admin, throw an UnauthorizedException
      if (!userIsAdmin) {
        throw new UnauthorizedException('You are not an admin of the organization');
      }
      // find the user in the database by email to add as a member
      const user = await this.userService.find('email', inviteUserDto.email);
      const userData: OrganizationMemberDto = { email: user.email, name: user.name, access_level: 'member' };
      // add the member to the organization members array
      const updatedOrganization = await this.organizationModel.findByIdAndUpdate(
        id,
        { $push: { organization_members: userData } },
        { new: true }
      );
      // return the message that the member was added
      return { message: 'Member added to organization' };
    } catch (error) {
      // if the organization NotFoundException, UnauthorizedException throw error
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      // throw an error if there was an error adding the member to the organization
      throw new InternalServerErrorException('Error adding member to organization');
    }
  }
}
