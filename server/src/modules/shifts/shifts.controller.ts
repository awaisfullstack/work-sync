import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../users/enums/users.enum';
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
  @Roles(Role.EMPLOYEE)
  @ApiOperation({ summary: 'Clock in current employee' })
  clockIn(@CurrentUser() user: AuthenticatedUser) {
    return this.shiftsService.clockIn(user.id);
  }

  @Post('clock-out')
  @ResponseMessage('Clock out successful')
  @Roles(Role.EMPLOYEE)
  @ApiOperation({ summary: 'Clock out current employee' })
  clockOut(@CurrentUser() user: AuthenticatedUser) {
    return this.shiftsService.clockOut(user.id);
  }

  @Get('me/active')
  @Roles(Role.EMPLOYEE)
  @ApiOperation({ summary: 'Get current employee active shift' })
  getMyActiveShift(@CurrentUser() user: AuthenticatedUser) {
    return this.shiftsService.getMyActiveShift(user.id);
  }

  @Get('me')
  @Roles(Role.EMPLOYEE, Role.ADMIN)
  @ApiOperation({ summary: 'Get current user shifts' })
  getMyShifts(
    @Query() query: ShiftQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.shiftsService.getAllShifts(query, user);
  }

  @Get('me/weekly-hours')
  @Roles(Role.EMPLOYEE)
  @ApiOperation({ summary: 'Get current employee weekly worked hours' })
  getMyWeeklyWorkedHours(@CurrentUser() user: AuthenticatedUser) {
    return this.shiftsService.getWeeklyWorkedHours(user.id);
  }

  @Get('me/worked-hours')
  @Roles(Role.EMPLOYEE)
  @ApiOperation({ summary: 'Get current employee worked hours' })
  getMyWorkedHours(@CurrentUser() user: AuthenticatedUser) {
    return this.shiftsService.getEmployeeWorkedHours(user.id);
  }

  @Post('manual')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a manual shift record' })
  @ResponseMessage('Manual shift created successfully')
  createManualShift(@Body() dto: ManualShiftDto) {
    return this.shiftsService.createManualShift(dto);
  }

  @Get('worked-hours')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get worked hours for all employees' })
  getAllEmployeesWorkedHours() {
    return this.shiftsService.getWorkedHours(undefined);
  }

  @Get('all-active-shifts')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all active shifts count' })
  getAllActiveShifts() {
    return this.shiftsService.getAllActiveShiftsCount();
  }

  @Get('user/:userId/worked-hours')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get worked hours for one employee' })
  getEmployeeWorkedHours(@Param('userId') userId: string) {
    return this.shiftsService.getEmployeeWorkedHours(userId);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get one shift by id' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.shiftsService.findOne(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete one shift by id' })
  @ResponseMessage('Shift deleted successfully')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.shiftsService.remove(id);
  }
}
