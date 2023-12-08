import {
  Body,
  Controller,
  Post,
  RawBodyRequest,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/middlewares/guards';
import { CheckoutSessionDto } from './dto';
import { StripeService } from './stripe.service';

@ApiTags('Stripe')
@Controller()
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('stripe/check-session')
  async createCheckSession(
    @Body() body: CheckoutSessionDto,
    @Res() res: Response,
  ) {
    const session = await this.stripeService.createCheckSession(body);

    return res.redirect(303, session.url);
  }

  @Post('webhook')
  async webhook(@Req() req: RawBodyRequest<Request>) {
    const sig = req.headers['stripe-signature'];
    const raw = req.rawBody.toString();

    return this.stripeService.handleHook(raw, sig);
  }
}
