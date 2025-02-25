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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { FilterCommentDto, SortCommentDto } from './dto/query-comment.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/roles/roles.guard';
import { Roles } from '@/roles/roles.decorator';
import { RoleEnum } from '@/roles/roles.enum';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { User } from '@/users/domain/user';
import { IPaginationOptions } from '@/utils/types/pagination-options';

@ApiTags('comments')
@Controller('comments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @Roles(RoleEnum.Admin, RoleEnum.User)
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  create(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: User,
  ) {
    // Inject user information into the DTO
    return this.commentsService.create({
      ...createCommentDto,
      userId: user.id,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Return all comments' })
  findAll(
    @Query() filterDto: FilterCommentDto,
    @Query() sortDto: SortCommentDto[],
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const paginationOptions: IPaginationOptions = { page, limit };
    return this.commentsService.findAll({
      filterOptions: filterDto,
      sortOptions: sortDto,
      paginationOptions,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get comment by id' })
  @ApiResponse({ status: 200, description: 'Return the comment' })
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.Admin, RoleEnum.User)
  @ApiOperation({ summary: 'Update comment by id' })
  @ApiResponse({ status: 200, description: 'Comment updated successfully' })
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: User,
  ) {
    // Add authorization check in service layer
    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.Admin, RoleEnum.User)
  @ApiOperation({ summary: 'Delete comment by id' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    // Add authorization check in service layer
    return this.commentsService.remove(id);
  }

  @Get('activity/:activityId')
  @ApiOperation({ summary: 'Get comments by activity id' })
  @ApiResponse({ status: 200, description: 'Return comments for the activity' })
  findByActivityId(@Param('activityId') activityId: string) {
    return this.commentsService.findByActivityId(activityId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get comments by user id' })
  @ApiResponse({ status: 200, description: 'Return comments for the user' })
  findByUserId(@Param('userId') userId: string) {
    return this.commentsService.findByUserId(userId);
  }
}
