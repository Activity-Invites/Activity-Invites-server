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
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { IPaginationResponse } from '@/utils/types/pagination-response';
import { Comment } from './domain/comment';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { User } from '@/users/domain/user';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoleEnum } from '../roles/roles.enum';
import { Roles } from '../roles/roles.decorator';

@ApiTags('评论')
@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @Roles(RoleEnum.Admin, RoleEnum.User)
  @ApiOperation({ summary: '创建评论' })
  @ApiResponse({
    status: 201,
    description: '评论创建成功',
    type: Comment,
  })
  create(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: User,
  ): Promise<Comment> {
    // Inject user information into the DTO
    return this.commentsService.create({
      ...createCommentDto,
      userId: String(user.id),
    });
  }

  @Get()
  @ApiOperation({ summary: '获取评论列表' })
  @ApiResponse({
    status: 200,
    description: '成功获取评论列表',
    type: Comment,
    isArray: true,
  })
  findAll(
    @Query() filterOptions: FilterCommentDto,
    @Query() sortOptions: SortCommentDto[],
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<IPaginationResponse<Comment>> {
    const paginationOptions: IPaginationOptions = {
      page,
      limit,
    };

    return this.commentsService.findAll({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: '获取指定评论' })
  @ApiResponse({
    status: 200,
    description: '成功获取评论',
    type: Comment,
  })
  findOne(@Param('id') id: string): Promise<Comment> {
    return this.commentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.Admin, RoleEnum.User)
  @ApiOperation({ summary: '更新评论' })
  @ApiResponse({
    status: 200,
    description: '评论更新成功',
    type: Comment,
  })
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: User,
  ): Promise<Comment> {
    // Add authorization check in service layer
    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.Admin, RoleEnum.User)
  @ApiOperation({ summary: '删除评论' })
  @ApiResponse({
    status: 200,
    description: '评论删除成功',
  })
  remove(@Param('id') id: string, @CurrentUser() user: User): Promise<void> {
    // Add authorization check in service layer
    return this.commentsService.remove(id);
  }

  @Get('activity/:activityId')
  @ApiOperation({ summary: '获取活动的所有评论' })
  @ApiResponse({
    status: 200,
    description: '成功获取活动的评论列表',
    type: Comment,
    isArray: true,
  })
  findByActivityId(@Param('activityId') activityId: string): Promise<Comment[]> {
    return this.commentsService.findByActivityId(activityId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: '获取用户的所有评论' })
  @ApiResponse({
    status: 200,
    description: '成功获取用户的评论列表',
    type: Comment,
    isArray: true,
  })
  findByUserId(@Param('userId') userId: string): Promise<Comment[]> {
    return this.commentsService.findByUserId(userId);
  }
}
