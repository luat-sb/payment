import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/middlewares/guards';
import { CheckoutSessionDto } from './dto';
import { StripeService } from './stripe.service';
import { Response } from 'express';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Stripe')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('check-session')
  async createCheckSession(
    @Body() body: CheckoutSessionDto,
    @Res() res: Response,
  ) {
    const session = await this.stripeService.createCheckSession(body);

    return res.redirect(303, session.url);
  }

  @Post('webhook')
  async webhook(@Body() body: any) {
    return this.stripeService.createCheckSession(body);
  }
}
