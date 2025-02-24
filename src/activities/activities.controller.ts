import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { Activity, ActivityStatus } from './domain/activities.entity';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/roles/roles.guard';
import { Roles } from '@/roles/roles.decorator';
import { RoleEnum } from '@/roles/roles.enum';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { User } from '@/users/domain/user';

@ApiTags('activities')
@Controller('activities')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @Roles(RoleEnum.Admin, RoleEnum.User)
  @ApiOperation({ summary: 'Create a new activity' })
  @ApiResponse({ status: 201, type: Activity })
  create(
    @Body() createActivityDto: CreateActivityDto,
    @CurrentUser() user: User,
  ): Promise<Activity> {
    return this.activitiesService.create(createActivityDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all activities' })
  @ApiResponse({ status: 200, type: [Activity] })
  findAll(
    @Query('isPublic') isPublic?: boolean,
    @Query('status') status?: ActivityStatus,
    @Query('creatorId') creatorId?: string,
  ): Promise<Activity[]> {
    return this.activitiesService.findAll({ isPublic, status, creatorId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get activity by id' })
  @ApiResponse({ status: 200, type: Activity })
  findOne(@Param('id') id: string): Promise<Activity> {
    return this.activitiesService.findOne(id);
  }

  @Patch(':id/publish')
  @Roles(RoleEnum.Admin, RoleEnum.User)
  @ApiOperation({ summary: 'Publish activity' })
  @ApiResponse({ status: 200, type: Activity })
  publish(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Activity> {
    return this.activitiesService.publish(id, user);
  }

  @Post(':id/invite-qr')
  @Roles(RoleEnum.Admin, RoleEnum.User)
  @ApiOperation({ summary: 'Generate invite QR code' })
  @ApiResponse({ status: 200, type: String })
  generateInviteQRCode(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<string> {
    return this.activitiesService.generateInviteQRCode(id, user);
  }

  @Post(':id/join')
  @Roles(RoleEnum.Admin, RoleEnum.User)
  @ApiOperation({ summary: 'Join activity' })
  @ApiResponse({ status: 200, type: Activity })
  join(@Param('id') id: string, @CurrentUser() user: User): Promise<Activity> {
    return this.activitiesService.join(id, user);
  }

  @Patch(':id/cancel')
  @Roles(RoleEnum.Admin, RoleEnum.User)
  @ApiOperation({ summary: 'Cancel activity' })
  @ApiResponse({ status: 200, type: Activity })
  cancel(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Activity> {
    return this.activitiesService.cancel(id, user);
  }
}
