import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseInterceptors, UseGuards } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { ReturnedOrganizationDto } from './dto/returned_organization.dto';
import { AuthGuard } from '../guards/auth.guard';
import { InviteUserDto } from './dto/invite-user.dto';
import { ApiErrorResponses } from '../common/decorators/api-error-response.decorator';

// organization controller that contains routes for organization
@ApiTags('Organization')
@ApiBearerAuth('JWT-auth') // apply JWT authentication to all routes
@Controller('organization')
export class OrganizationController {
  // inject organization service into the controller
  constructor(
    private readonly organizationService: OrganizationService
  ) {}

  // POST /organization - create organization
  @Post()
  @UseGuards(AuthGuard) // protect the route with JWT authentication
  @UseInterceptors(new TransformInterceptor(ReturnedOrganizationDto)) // transform the response data to the ReturnedOrganizationDto
  @ApiOperation({ summary: 'Create organization for the user' })
  @ApiResponse({ status: 200, description: 'Organization created successfully', type: ReturnedOrganizationDto })
  @ApiErrorResponses([400, 401, 500]) // apply custom error responses
  async create(@Body() createOrganizationDto: CreateOrganizationDto, @Req() req: any){
    return await this.organizationService.create(createOrganizationDto, req.user);
  }

  // GET /organization - get all organizations
  @Get()
  @UseGuards(AuthGuard) // protect the route with JWT authentication
  @UseInterceptors(new TransformInterceptor(ReturnedOrganizationDto)) // transform the response data to the ReturnedOrganizationDto
  @ApiOperation({ summary: 'Get all organizations' })
  @ApiResponse({ status: 200, description: 'Return all organizations', type: [ReturnedOrganizationDto] })
  @ApiErrorResponses([401, 500]) // apply custom error responses
  async findAll() {
    return await this.organizationService.findAll();
  }

  // GET /organization/:id - get organization by id
  @Get(':id')
  @UseGuards(AuthGuard) // protect the route with JWT authentication
  @UseInterceptors(new TransformInterceptor(ReturnedOrganizationDto)) // transform the response data to the ReturnedOrganizationDto
  @ApiOperation({ summary: 'Get organization by id' })
  @ApiResponse({ status: 200, description: 'Return organization by id', type: ReturnedOrganizationDto })
  @ApiErrorResponses([400, 401, 500]) // apply custom error responses
  async findOne(@Param('id') id: string) {
    return await this.organizationService.findOne(id);
  }

  // PATCH /organization/:id - update organization by id
  @Patch(':id')
  @UseGuards(AuthGuard) // protect the route with JWT authentication
  @UseInterceptors(new TransformInterceptor(ReturnedOrganizationDto)) // transform the response data to the ReturnedOrganizationDto
  @ApiOperation({ summary: 'Update organization by id' })
  @ApiResponse({ status: 200, description: 'Organization updated successfully', type: ReturnedOrganizationDto })
  @ApiErrorResponses([400, 401, 404, 500]) // apply custom error responses
  async update(@Param('id') id: string, @Body() updateOrganizationDto: UpdateOrganizationDto, @Req() req: any) {
    return await this.organizationService.update(id, updateOrganizationDto, req.user);
  }

  // DELETE /organization/:id - delete organization by id
  @Delete(':id')
  @UseGuards(AuthGuard) // protect the route with JWT authentication
  @ApiOperation({ summary: 'Delete organization by id' })
  @ApiResponse({ status: 200, description: 'Organization deleted successfully' })
  @ApiErrorResponses([400, 401, 500]) // apply custom error responses
  async remove(@Param('id') id: string, @Req() req: any) {
    return await this.organizationService.remove(id, req.user);
  }

  // POST /organization/:id/invite - invite user to organization
  @Post(':id/invite')
  @UseGuards(AuthGuard) // protect the route with JWT authentication
  @ApiOperation({ summary: 'Invite user to organization' })
  @ApiResponse({ status: 200, description: 'User invited successfully' })
  @ApiErrorResponses([400, 401, 404, 500]) // apply custom error responses
  async inviteUser(@Param('id') id: string, @Body() inviteUserDto: InviteUserDto, @Req() req: any) {
    return await this.organizationService.addMember(id, inviteUserDto, req.user);
  } 
}
