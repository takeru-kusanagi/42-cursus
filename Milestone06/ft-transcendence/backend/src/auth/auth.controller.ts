import { Body, Controller, Delete, Post, Get, Patch, UseGuards, UseFilters, Query, Req, Res, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ExportService } from './export.service';
import { MailService } from '../mail/mail.service';
import { GoogleCallbackExceptionFilter } from './google-callback-exception.filter';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

const VALID_FORMATS = ['json', 'csv', 'xml'] as const;
type ExportFormat = typeof VALID_FORMATS[number];

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly exportService: ExportService,
    private readonly mailService: MailService,
  ) {}

  @Post('register')
  async register(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('name') name: string,
  ) {
    return this.authService.register(username, password, name);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Guard redirects to Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @UseFilters(GoogleCallbackExceptionFilter)
  async googleAuthCallback(@Req() req: { user: { id: string } }, @Res() res: Response) {
    const token = this.authService.getTokenForUser(req.user.id);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8443';
    const redirectUrl = `${frontendUrl}/login/callback?token=${token}`;
    res.redirect(redirectUrl);
  }

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(username, password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: { id: string }) {
    return this.authService.validateUser(user.id);
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  async deleteAccount(@CurrentUser() user: { id: string }) {
    return this.authService.deleteAccount(user.id);
  }

  @Get('profile/export')
  @UseGuards(JwtAuthGuard)
  async exportProfile(
    @CurrentUser() user: { id: string },
    @Query('format') format: string = 'json',
    @Res() res: Response,
  ) {
    const fmt = (format || 'json').toLowerCase() as ExportFormat;
    if (!VALID_FORMATS.includes(fmt)) {
      throw new BadRequestException(`Invalid format: ${format}. Use json, csv, or xml.`);
    }

    const data = await this.exportService.getExportData(user.id);
    const username = data.profile.username.replace(/[^a-zA-Z0-9_-]/g, '_');

    const formatConfig = {
      json: { content: this.exportService.toJson(data), mimeType: 'application/json', ext: 'json' },
      csv:  { content: this.exportService.toCsv(data),  mimeType: 'text/csv',          ext: 'csv' },
      xml:  { content: this.exportService.toXml(data),   mimeType: 'application/xml',   ext: 'xml' },
    } as const;

    const { content, mimeType, ext } = formatConfig[fmt];

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="pong_export_${username}.${ext}"`);
    res.send(content);

    if (data.profile.email && data.profile.emailVerified) {
      this.mailService.sendDataExportNotification(data.profile.email).catch((err) => {
        console.error('[Auth] Failed to send data export email:', err);
      });
    }
  }

  @Post('profile/import')
  @UseGuards(JwtAuthGuard)
  async importProfile(
    @CurrentUser() user: { id: string },
    @Body('data') data: string,
  ) {
    if (!data || typeof data !== 'string') {
      throw new BadRequestException('Missing data field');
    }
    return this.authService.importProfile(user.id, data);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@CurrentUser() user: { id: string }) {
    return this.authService.getProfile(user.id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser() user: { id: string },
    @Body('name') name: string,
  ) {
    return this.authService.updateName(user.id, name);
  }

  @Post('profile/change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @CurrentUser() user: { id: string },
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.changePassword(user.id, currentPassword, newPassword);
  }

  @Post('email/request')
  @UseGuards(JwtAuthGuard)
  async requestEmailVerification(
    @CurrentUser() user: { id: string },
    @Body('email') email: string,
  ) {
    return this.authService.requestEmailVerification(user.id, email);
  }

  @Post('email/resend')
  @UseGuards(JwtAuthGuard)
  async resendVerificationEmail(@CurrentUser() user: { id: string }) {
    return this.authService.resendVerificationEmail(user.id);
  }

@Get('email/verify')
  async verifyEmail(
    @Query('token') token: string,
    @Res() res: Response
  ) {
    try {
      await this.authService.verifyEmail(token);
      const frontendUrl = process.env.FRONTEND_URL || 'https://localhost:8443';
      return res.redirect(`${frontendUrl}/settings?verified=true`);
    } catch (error) {
      const frontendUrl = process.env.FRONTEND_URL || 'https://localhost:8443';
      return res.redirect(`${frontendUrl}/settings?error=invalid_token`);
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('password') password: string,
  ) {
    return this.authService.resetPassword(token, password);
  }
  @Post('2fa/setup')
  @UseGuards(JwtAuthGuard)
  async setupTwoFactor(@CurrentUser() user: { id: string }) {
    return this.authService.setupTwoFactor(user.id);
  }

  @Post('2fa/verify-setup')
  @UseGuards(JwtAuthGuard)
  async verifyTwoFactorSetup(
    @CurrentUser() user: { id: string },
    @Body('code') code: string,
  ) {
    return this.authService.verifyTwoFactorSetup(user.id, code);
  }

  @Post('2fa/verify')
  async verifyTwoFactor(
    @Body('tempToken') tempToken: string,
    @Body('code') code: string,
  ) {
    return this.authService.verifyTwoFactor(tempToken, code);
  }

  @Post('2fa/disable')
  @UseGuards(JwtAuthGuard)
  async disableTwoFactor(
    @CurrentUser() user: { id: string },
    @Body('password') password: string,
    @Body('code') code: string,
  ) {
    return this.authService.disableTwoFactor(user.id, password, code);
  }
}
