import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../common/types/auth.types';
import { ShiftQueryDto } from './dto/shift-query.dto';
import { ManualShiftDto } from './dto/manual-shift.dto';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller('shifts')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Shifts')
@ApiCookieAuth('access_token')
@ApiBearerAuth('access-token')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Post('clock-in')
  @ResponseMessage('Clock in successful')
  @Roles(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Clock in current employee' })
  clockIn(@CurrentUser() user: AuthenticatedUser) {
    return this.shiftsService.clockIn(user.id);
  }

  @Post('clock-out')
  @ResponseMessage('Clock out successful')
  @Roles(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Clock out current employee' })
  clockOut(@CurrentUser() user: AuthenticatedUser) {
    return this.shiftsService.clockOut(user.id);
  }

  @Get('me/active')
  @Roles(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Get current employee active shift' })
  getMyActiveShift(@CurrentUser() user: AuthenticatedUser) {
    return this.shiftsService.getMyActiveShift(user.id);
  }

  @Get('me')
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get current user shifts' })
  getMyShifts(
    @Query() query: ShiftQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.shiftsService.getAllShifts(query, user);
  }

  @Get('me/weekly-hours')
  @Roles(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Get current employee weekly worked hours' })
  getMyWeeklyWorkedHours(@CurrentUser() user: AuthenticatedUser) {
    return this.shiftsService.getWeeklyWorkedHours(user.id);
  }

  @Get('me/worked-hours')
  @Roles(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Get current employee worked hours' })
  getMyWorkedHours(
    @CurrentUser() user: AuthenticatedUser,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.shiftsService.getEmployeeWorkedHours(user.id, fromDate, toDate);
  }

  @Post('manual')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a manual shift record' })
  createManualShift(@Body() dto: ManualShiftDto) {
    return this.shiftsService.createManualShift(dto);
  }

  @Get('worked-hours')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get worked hours for all employees' })
  getAllEmployeesWorkedHours(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.shiftsService.getWorkedHours(undefined, fromDate, toDate);
  }

  @Get('user/:userId/worked-hours')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get worked hours for one employee' })
  getEmployeeWorkedHours(
    @Param('userId') userId: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.shiftsService.getEmployeeWorkedHours(userId, fromDate, toDate);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get one shift by id' })
  findOne(@Param('id') id: string) {
    return this.shiftsService.findOne(id);
  }
}
