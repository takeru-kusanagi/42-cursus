import { Controller, Get, Post, Body, Headers, Param, UnauthorizedException } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.adminService.login(username, password);
  }

  @Get('users')
  async getUsers(@Headers('authorization') auth: string) {
    const token = auth?.replace(/^Bearer\s+/i, '');
    if (!token || !this.adminService.validateToken(token)) {
      throw new UnauthorizedException('Invalid or expired admin token');
    }
    const users = await this.adminService.getAllUsers();
    return { total: users.length, users };
  }

  @Post('users/:id/clear-email-verification')
  async clearEmailVerification(
    @Headers('authorization') auth: string,
    @Param('id') userId: string,
  ) {
    const token = auth?.replace(/^Bearer\s+/i, '');
    if (!token || !this.adminService.validateToken(token)) {
      throw new UnauthorizedException('Invalid or expired admin token');
    }
    await this.adminService.clearEmailVerification(userId);
    return { success: true };
  }
}
