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
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from 'src/types';
import { ShiftQueryDto } from './dto/shift-query.dto';
import { ManualShiftDto } from './dto/manual-shift.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@Controller('shifts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Post('clock-in')
  @ResponseMessage('Clock in successful')
  @Roles(UserRole.EMPLOYEE)
  clockIn(@CurrentUser() user: AuthenticatedUser) {
    return this.shiftsService.clockIn(user.id);
  }

  @Post('clock-out')
  @ResponseMessage('Clock out successful')
  @Roles(UserRole.EMPLOYEE)
  clockOut(@CurrentUser() user: AuthenticatedUser) {
    return this.shiftsService.clockOut(user.id);
  }

  @Get('me/active')
  @Roles(UserRole.EMPLOYEE)
  getMyActiveShift(@CurrentUser() user: AuthenticatedUser) {
    return this.shiftsService.getMyActiveShift(user.id);
  }

  @Get('me')
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN)
  getMyShifts(
    @Query() query: ShiftQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.shiftsService.getAllShifts(query, user);
  }

  @Get('me/weekly-hours')
  @Roles(UserRole.EMPLOYEE)
  getMyWeeklyWorkedHours(@CurrentUser() user: AuthenticatedUser) {
    return this.shiftsService.getWeeklyWorkedHours(user.id);
  }

  @Post('manual')
  @Roles(UserRole.ADMIN)
  createManualShift(@Body() dto: ManualShiftDto) {
    return this.shiftsService.createManualShift(dto);
  }

  @Get('user/:userId/worked-hours')
  @Roles(UserRole.ADMIN)
  getEmployeeWorkedHours(
    @Param('userId') userId: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.shiftsService.getEmployeeWorkedHours(userId, fromDate, toDate);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.shiftsService.findOne(id);
  }
}
