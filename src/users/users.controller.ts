import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../auth/enums/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SYSTEM_ADMINISTRATOR)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 4) Create User (Admin)
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  // 5) Get Users (Admin)
  @Get()
  async list(@Query('page') page = '1', @Query('pageSize') pageSize = '20') {
    return this.usersService.list({
      page: Number(page),
      pageSize: Number(pageSize),
    });
  }

  // 6) Update User (Admin)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }
}

// Separate controller methods that don't require admin role
@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
export class UsersPublicController {
  constructor(private readonly usersService: UsersService) {}

  // Get users by province (for incident reporting) - All authenticated users
  @UseGuards(JwtAuthGuard)
  @Get('province/:provinceId')
  async listByProvince(@Param('provinceId') provinceId: string) {
    return this.usersService.listByProvince(provinceId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('filter')
  async listFiltered(
    @Query('provinceId') provinceId?: string,
    @Query('departmentId') departmentId?: string,
    @Query('role') role?: string,
  ) {
    return this.usersService.listFiltered({ provinceId, departmentId, role });
  }
}
