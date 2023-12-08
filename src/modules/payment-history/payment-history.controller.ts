import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TimerDto } from 'src/common';
import { JwtAuthGuard } from 'src/middlewares/guards';
import { QueryPaymentHistoryDto } from './dto';
import { PaymentHistoryService } from './payment-history.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('PaymentHistory')
@Controller('payment-history')
export class PaymentHistoryController {
  constructor(private readonly paymentHistoryService: PaymentHistoryService) {}

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.paymentHistoryService.getOne(id);
  }

  @Post('listing')
  async getList(
    @Query() query: TimerDto,
    @Body() body: QueryPaymentHistoryDto,
  ) {
    return this.paymentHistoryService.getListPaymentHistory(
      Object.assign(query, body),
    );
  }
}
