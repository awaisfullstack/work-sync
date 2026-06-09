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
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
@ApiTags('Users')
@ApiCookieAuth('access_token')
@ApiBearerAuth('access-token')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a user' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  @ApiOperation({ summary: 'List users with filters and pagination' })
  findAll(@Query() query: QueryUsersDto) {
    return this.usersService.findAll(query);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get user statistics' })
  getUserStats() {
    return this.usersService.getUserStats();
  }

  @Roles(UserRole.ADMIN)
  @Get('options')
  @ApiOperation({ summary: 'Get user options for select inputs' })
  findUserOptions() {
    return this.usersService.findUserOptions();
  }

  @Roles(UserRole.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Get one user by id' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a user' })
  deactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deactivate(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a user' })
  activate(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.activate(id);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
