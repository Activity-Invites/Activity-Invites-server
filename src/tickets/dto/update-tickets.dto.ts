// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateticketsDto } from './create-tickets.dto';

export class UpdateticketsDto extends PartialType(CreateticketsDto) {}
