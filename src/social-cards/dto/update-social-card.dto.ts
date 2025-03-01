// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateSocialCardDto } from './create-social-card.dto';

export class UpdateSocialCardDto extends PartialType(CreateSocialCardDto) {}
