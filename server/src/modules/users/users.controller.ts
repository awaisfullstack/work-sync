import {
  Controller,
  Delete,
  Get,
  Body,
  Post,
  Patch,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from './enums/users.enum';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../common/types/auth.types';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
@ApiTags('Users')
@ApiCookieAuth('access_token')
@ApiBearerAuth('access-token')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ResponseMessage('User created successfully')
  create(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<null> {
    return this.usersService.create(createUserDto, user.id);
  }

  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'List users with filters and pagination' })
  findAll(@Query() query: QueryUsersDto) {
    return this.usersService.findAll(query);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get user statistics' })
  getUserStats() {
    return this.usersService.getUserStats();
  }

  @Roles(Role.ADMIN)
  @Get('options')
  @ApiOperation({ summary: 'Get user options for select inputs' })
  findUserOptions() {
    return this.usersService.findUserOptions();
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Get one user by id' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ResponseMessage('User updated successfully')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<null> {
    return this.usersService.update(id, updateUserDto, user.id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a user' })
  @ResponseMessage('User deactivated successfully')
  deactivate(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<null> {
    return this.usersService.deactivate(id, user.id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a user' })
  @ResponseMessage('User activated successfully')
  activate(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<null> {
    return this.usersService.activate(id, user.id);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ResponseMessage('User deleted successfully')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<null> {
    return this.usersService.remove(id, user.id);
  }
}
