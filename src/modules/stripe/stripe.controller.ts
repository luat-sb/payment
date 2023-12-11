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
import { CheckoutSessionDto, PaymentIntentDto } from './dto';
import { StripeService } from './stripe.service';
import { UserDecorator } from 'src/common/decorators';
import { IJwtPayload } from 'src/common/interfaces/auth.interface';

@ApiTags('Stripe')
@Controller()
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('stripe/checkout-session')
  async createCheckSession(
    @Body() body: CheckoutSessionDto,
    @Res() res: Response,
  ) {
    const session = await this.stripeService.createCheckSession(body);

    return res.redirect(303, session.url);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('stripe/create-payment-intent')
  async createPaymentIntent(
    @Body() body: PaymentIntentDto,
    @UserDecorator() user: IJwtPayload,
  ) {
    Object.assign(body, {
      userStripeId: user.stripeId,
      userId: user.id || user.userId,
    });
    const session = await this.stripeService.createPaymentIntent(body);

    return { clientSecret: session.client_secret };
  }

  @Post('webhook')
  async webhook(@Req() req: RawBodyRequest<Request>) {
    const sig = req.headers['stripe-signature'];
    const raw = req.rawBody.toString();

    return this.stripeService.handleHook(raw, sig);
  }
}
