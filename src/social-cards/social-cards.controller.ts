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
import { SocialCardsService } from './social-cards.service';
import { CreateSocialCardDto } from './dto/create-social-card.dto';
import { UpdateSocialCardDto } from './dto/update-social-card.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { SocialCard } from './domain/social-card';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllSocialCardsDto } from './dto/find-all-social-cards.dto';

@ApiTags('Socialcards')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'social-cards',
  version: '1',
})
export class SocialCardsController {
  constructor(private readonly socialCardsService: SocialCardsService) {}

  @Post()
  @ApiCreatedResponse({
    type: SocialCard,
  })
  create(@Body() createSocialCardDto: CreateSocialCardDto) {
    return this.socialCardsService.create(createSocialCardDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(SocialCard),
  })
  async findAll(
    @Query() query: FindAllSocialCardsDto,
  ): Promise<InfinityPaginationResponseDto<SocialCard>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.socialCardsService.findAllWithPagination({
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
    type: SocialCard,
  })
  findById(@Param('id') id: string) {
    return this.socialCardsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: SocialCard,
  })
  update(
    @Param('id') id: string,
    @Body() updateSocialCardDto: UpdateSocialCardDto,
  ) {
    return this.socialCardsService.update(id, updateSocialCardDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.socialCardsService.remove(id);
  }
}
