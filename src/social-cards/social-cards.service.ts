import { Injectable } from '@nestjs/common';
import { CreateSocialCardDto } from './dto/create-social-card.dto';
import { UpdateSocialCardDto } from './dto/update-social-card.dto';
import { SocialCardRepository } from './infrastructure/persistence/social-card.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { SocialCard } from './domain/social-card';

@Injectable()
export class SocialCardsService {
  constructor(
    // Dependencies here
    private readonly socialCardRepository: SocialCardRepository,
  ) {}

  
  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createSocialCardDto: CreateSocialCardDto
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.socialCardRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.socialCardRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: SocialCard['id']) {
    return this.socialCardRepository.findById(id);
  }

  findByIds(ids: SocialCard['id'][]) {
    return this.socialCardRepository.findByIds(ids);
  }

  async update(
    id: SocialCard['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateSocialCardDto: UpdateSocialCardDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.socialCardRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: SocialCard['id']) {
    return this.socialCardRepository.remove(id);
  }
}
