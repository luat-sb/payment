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
import { UserDecorator } from 'src/common/decorators';
import { TimerDto } from 'src/common/dto';
import { IJwtPayload } from 'src/common/interfaces/auth.interface';
import { JwtAuthGuard } from 'src/middlewares/guards';
import {
  CreateUserDto,
  DeleteUserDto,
  QueryUserDto,
  UpdateUserDto,
} from './dto';
import { UserService } from './user.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@UserDecorator() user: IJwtPayload) {
    return this.userService.getOne(user.userId);
  }

  @Post('listing')
  async getList(@Query() query: TimerDto, @Body() body: QueryUserDto) {
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

  @Post('delete')
  async deleteManyUser(@Body() body: DeleteUserDto) {
    const { ids } = body;
    return this.userService.deleteManyUser(ids);
  }
}
