import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/middlewares/guards';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserService } from './user.service';
import { TimerDto } from 'src/common/dto';
import { QueryUserDto } from './dto/query.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('listing')
  async getListOrder(@Query() query: TimerDto, @Body() body: QueryUserDto) {
    return this.userService.getListUser(Object.assign(query, body));
  }

  @Post('create')
  async createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @Post('update/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(id, body);
  }

  @Delete('delete/:id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
