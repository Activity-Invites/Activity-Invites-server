import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { FilterTicketDto, SortTicketDto } from './dto/query-ticket.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/roles/roles.guard';
import { Roles } from '@/roles/roles.decorator';
import { RoleEnum } from '@/roles/roles.enum';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { User } from '@/users/domain/user';
import { IPaginationOptions } from '@/utils/types/pagination-options';

@ApiTags('tickets')
@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @Roles(RoleEnum.Admin, RoleEnum.User)
  @ApiOperation({ summary: 'Create a new ticket' })
  @ApiResponse({ status: 201, description: 'Ticket created successfully' })
  create(
    @Body() createTicketDto: CreateTicketDto,
    @CurrentUser() user: User,
  ) {
    // Inject user information into the DTO
    return this.ticketsService.create({
      ...createTicketDto,
      userId: String(user.id),
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all tickets with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Return all tickets' })
  findAll(
    @Query() filterDto: FilterTicketDto,
    @Query() sortDto: SortTicketDto[],
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const paginationOptions: IPaginationOptions = { page, limit };
    return this.ticketsService.findAll({
      filterOptions: filterDto,
      sortOptions: sortDto,
      paginationOptions,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket by id' })
  @ApiResponse({ status: 200, description: 'Return the ticket' })
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.Admin, RoleEnum.User)
  @ApiOperation({ summary: 'Update ticket by id' })
  @ApiResponse({ status: 200, description: 'Ticket updated successfully' })
  update(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
    @CurrentUser() user: User,
  ) {
    // Add authorization check in service layer
    return this.ticketsService.update(id, updateTicketDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.Admin, RoleEnum.User)
  @ApiOperation({ summary: 'Delete ticket by id' })
  @ApiResponse({ status: 200, description: 'Ticket deleted successfully' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    // Add authorization check in service layer
    return this.ticketsService.remove(id);
  }

  @Get('activity/:activityId')
  @ApiOperation({ summary: 'Get tickets by activity id' })
  @ApiResponse({ status: 200, description: 'Return tickets for the activity' })
  findByActivityId(@Param('activityId') activityId: string) {
    return this.ticketsService.findByActivityId(activityId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get tickets by user id' })
  @ApiResponse({ status: 200, description: 'Return tickets for the user' })
  findByUserId(@Param('userId') userId: string) {
    return this.ticketsService.findByUserId(userId);
  }

  @Get('activity/:activityId/user/:userId')
  @ApiOperation({ summary: 'Get ticket by activity id and user id' })
  @ApiResponse({ status: 200, description: 'Return ticket for the activity and user' })
  findByActivityIdAndUserId(
    @Param('activityId') activityId: string,
    @Param('userId') userId: string,
  ) {
    return this.ticketsService.findByActivityIdAndUserId(activityId, userId);
  }
}
