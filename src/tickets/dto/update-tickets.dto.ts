// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateTicketsDto } from './create-tickets.dto';

export class UpdateTicketsDto extends PartialType(CreateTicketsDto) {}
