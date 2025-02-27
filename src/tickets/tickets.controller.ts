import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ticketsService } from './tickets.service';
import { CreateticketsDto } from './dto/create-tickets.dto';
import { UpdateticketsDto } from './dto/update-tickets.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { tickets } from './domain/tickets';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllticketsDto } from './dto/find-all-tickets.dto';

@ApiTags('Tickets')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'tickets',
  version: '1',
})
export class ticketsController {
  constructor(private readonly ticketsService: ticketsService) {}

  @Post()
  @ApiCreatedResponse({
    type: tickets,
  })
  create(@Body() createticketsDto: CreateticketsDto) {
    return this.ticketsService.create(createticketsDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(tickets),
  })
  async findAll(
    @Query() query: FindAllticketsDto,
  ): Promise<InfinityPaginationResponseDto<tickets>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.ticketsService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: tickets,
  })
  findById(@Param('id') id: string) {
    return this.ticketsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: tickets,
  })
  update(@Param('id') id: string, @Body() updateticketsDto: UpdateticketsDto) {
    return this.ticketsService.update(id, updateticketsDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(id);
  }
}
