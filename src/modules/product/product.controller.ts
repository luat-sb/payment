import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TimerDto } from 'src/common';
import { JwtAuthGuard } from 'src/middlewares/guards';
import { CreateProductDto, QueryProductDto, UpdateProductDto } from './dto';
import { ProductService } from './product.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.productService.getOne(id);
  }

  @Post('listing')
  async getList(@Query() query: TimerDto, @Body() body: QueryProductDto) {
    return this.productService.getListProduct(Object.assign(query, body));
  }

  @Post('create')
  async createProduct(@Body() body: CreateProductDto) {
    return this.productService.createProduct(body);
  }

  @Post('update/:id')
  async updateProduct(@Param('id') id: string, @Body() body: UpdateProductDto) {
    return this.productService.update(id, body);
  }

  @Delete('delete/:id')
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
