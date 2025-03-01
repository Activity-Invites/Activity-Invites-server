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
import { QRCodesService } from './q-r-codes.service';
import { CreateQRCodeDto } from './dto/create-q-r-code.dto';
import { UpdateQRCodeDto } from './dto/update-q-r-code.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { QRCode } from './domain/q-r-code';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllQRCodesDto } from './dto/find-all-q-r-codes.dto';

@ApiTags('Qrcodes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'q-r-codes',
  version: '1',
})
export class QRCodesController {
  constructor(private readonly qRCodesService: QRCodesService) {}

  @Post()
  @ApiCreatedResponse({
    type: QRCode,
  })
  create(@Body() createQRCodeDto: CreateQRCodeDto) {
    return this.qRCodesService.create(createQRCodeDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(QRCode),
  })
  async findAll(
    @Query() query: FindAllQRCodesDto,
  ): Promise<InfinityPaginationResponseDto<QRCode>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.qRCodesService.findAllWithPagination({
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
    type: QRCode,
  })
  findById(@Param('id') id: string) {
    return this.qRCodesService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: QRCode,
  })
  update(
    @Param('id') id: string,
    @Body() updateQRCodeDto: UpdateQRCodeDto,
  ) {
    return this.qRCodesService.update(id, updateQRCodeDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.qRCodesService.remove(id);
  }
}
