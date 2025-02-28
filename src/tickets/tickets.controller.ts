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
import { TicketsService } from './tickets.service';
import { CreateTicketsDto } from './dto/create-tickets.dto';
import { UpdateTicketsDto } from './dto/update-tickets.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Tickets } from './domain/tickets';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllTicketsDto } from './dto/find-all-tickets.dto';

@ApiTags('Tickets')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'tickets',
  version: '1',
})
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiCreatedResponse({
    type: Tickets,
  })
  create(@Body() createTicketsDto: CreateTicketsDto) {
    return this.ticketsService.create(createTicketsDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Tickets),
  })
  async findAll(
    @Query() query: FindAllTicketsDto,
  ): Promise<InfinityPaginationResponseDto<Tickets>> {
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
    type: Tickets,
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
    type: Tickets,
  })
  update(@Param('id') id: string, @Body() updateTicketsDto: UpdateTicketsDto) {
    return this.ticketsService.update(id, updateTicketsDto);
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
