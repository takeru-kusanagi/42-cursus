import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

@Injectable()
export class AuthService {
  private static readonly MAX_INPUT_LENGTH = 20;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  private assertMaxLength(field: string, value: string) {
    if (typeof value !== 'string' || value.length > AuthService.MAX_INPUT_LENGTH) {
      throw new BadRequestException(`${field} must be 20 characters or fewer`);
    }
  }

  async register(username: string, password: string, name: string) {
    this.assertMaxLength('Username', username);
    this.assertMaxLength('Password', password);
    this.assertMaxLength('Nickname', name);
    const existing = await this.prisma.user.findUnique({ where: { username } });
    if (existing) {
      throw new ConflictException('Username already exists');
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { username, password: hashed, name },
    });
    const token = this.jwtService.sign({ sub: user.id });
    return { user: { id: user.id, username: user.username, name: user.name }, token };
  }

  async login(username: string, password: string) {
    this.assertMaxLength('Username', username);
    this.assertMaxLength('Password', password);
    const user = await this.prisma.user.findUnique({ where: { username } });
    const provider = (user as { provider?: string }).provider ?? 'local';
    if (!user || provider !== 'local' || !user.password || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid username or password');
    }
    if (user.twoFactorEnabled) {
      const tempToken = this.jwtService.sign(
        { sub: user.id, purpose: '2fa' },
        { expiresIn: '5m' },
      );
      return { requiresTwoFactor: true, tempToken };
    }
    const token = this.jwtService.sign({ sub: user.id });
    return { user: { id: user.id, username: user.username, name: user.name }, token };
  }

  async validateOrCreateGoogleUser(profile: {
    googleId: string;
    email?: string;
    name: string;
    picture?: string;
  }) {
    const existing = await this.prisma.user.findFirst({
      where: { provider: 'google', providerId: profile.googleId },
      select: { id: true, username: true, name: true },
    });
    if (existing) {
      await this.prisma.user.update({
        where: { id: existing.id },
        data: {
          googleName: profile.name,
          avatar: profile.picture ?? null,
          emailVerified: true,
          ...(profile.email && { email: profile.email }),
        },
      });
      return existing;
    }
    if (profile.email) {
      const emailUser = await this.prisma.user.findUnique({
        where: { email: profile.email.toLowerCase().trim() },
        select: { provider: true },
      });
      if (emailUser?.provider === 'local') {
        throw new ConflictException(
          'This email is already registered. Please log in with your username and password.',
        );
      }
    }
    const username = `google_${profile.googleId}`;
    return this.prisma.user.create({
      data: {
        username,
        provider: 'google',
        providerId: profile.googleId,
        googleName: profile.name,
        name: profile.name,
        email: profile.email ?? null,
        emailVerified: !!profile.email,
        avatar: profile.picture ?? null,
      },
      select: { id: true, username: true, name: true },
    });
  }

  getTokenForUser(userId: string) {
    return this.jwtService.sign({ sub: userId });
  }

  async validateUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        emailVerified: true,
        twoFactorEnabled: true,
        avatar: true,
      },
    });
    return user ?? null;
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        name: true,
        googleName: true,
        email: true,
        emailVerified: true,
        twoFactorEnabled: true,
        provider: true,
        avatar: true,
        gamesAsPlayer1: {
          select: {
            id: true,
            player1Score: true,
            player2Score: true,
            winnerId: true,
            createdAt: true,
            player2: { select: { name: true } },
          },
        },
        gamesAsPlayer2: {
          select: {
            id: true,
            player1Score: true,
            player2Score: true,
            winnerId: true,
            createdAt: true,
            player1: { select: { name: true } },
          },
        },
      },
    });
    if (!user) return null;
    const games = [
      ...user.gamesAsPlayer1.map((g) => ({
        id: g.id,
        userScore: g.player1Score,
        opponentScore: g.player2Score,
        opponentName: g.player2?.name ?? 'Deleted User',
        winnerId: g.winnerId,
        createdAt: g.createdAt,
      })),
      ...user.gamesAsPlayer2.map((g) => ({
        id: g.id,
        userScore: g.player2Score,
        opponentScore: g.player1Score,
        opponentName: g.player1?.name ?? 'Deleted User',
        winnerId: g.winnerId,
        createdAt: g.createdAt,
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const provider = user.provider ?? 'local';
    const avatar = user.avatar ?? null;
    const googleName = user.googleName ?? null;
    return { id: user.id, username: user.username, name: user.name, googleName, email: user.email, emailVerified: user.emailVerified, twoFactorEnabled: user.twoFactorEnabled, provider, avatar, games };
  }

  async updateName(userId: string, name: string) {
    this.assertMaxLength('Nickname', name);
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { name },
      select: { id: true, username: true, name: true },
    });
    return user;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    this.assertMaxLength('Current password', currentPassword);
    this.assertMaxLength('New password', newPassword);
    if (!newPassword || newPassword.length < 6) {
      throw new BadRequestException('New password must be at least 6 characters');
    }
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });
    if (!user) throw new BadRequestException('User not found');
    const provider = (user as { provider?: string }).provider ?? 'local';
    if (provider !== 'local' || !user.password) {
      throw new BadRequestException('Password cannot be changed for third-party accounts');
    }
    if (!(await bcrypt.compare(currentPassword, user.password))) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });
    return { message: 'Password changed successfully' };
  }

  async requestEmailVerification(userId: string, email: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== userId) {
      throw new ConflictException('Email already in use');
    }
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const baseUrl = process.env.APP_URL || process.env.FRONTEND_URL || 'http://localhost';
    const verifyUrl = `${baseUrl}/api/auth/email/verify?token=${token}`;

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        email: email.toLowerCase().trim(),
        emailVerified: false,
        emailVerifyToken: token,
        emailVerifyExpires: expires,
      },
    });

    await this.mailService.sendVerificationEmail(email, verifyUrl);
    return { message: 'Verification email sent' };
  }

  async verifyEmail(token: string) {
    if (!token || typeof token !== 'string' || token.trim().length === 0) {
      throw new BadRequestException('Invalid or expired token');
    }
    const user = await this.prisma.user.findFirst({
      where: { emailVerifyToken: token },
    });
    if (!user) throw new BadRequestException('Invalid or expired token');
    if (!user.emailVerifyExpires || user.emailVerifyExpires < new Date()) {
      throw new BadRequestException('Token expired');
    }
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifyToken: null,
        emailVerifyExpires: null,
      },
    });
    return { message: 'Email verified' };
  }

  async resendVerificationEmail(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    if (!user?.email) throw new BadRequestException('No email to verify');
    return this.requestEmailVerification(userId, user.email);
  }

  async forgotPassword(email: string) {
    if (!email || typeof email !== 'string' || !email.trim()) {
      throw new BadRequestException('Email is required');
    }
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, email: true, emailVerified: true, provider: true },
    });
    if (!user) throw new BadRequestException('No account found with this email');
    if (user.provider === 'google') {
      throw new BadRequestException(
        'This account uses Google sign-in. Please use the Google button on the login page.',
      );
    }
    if (!user.emailVerified) {
      throw new BadRequestException('You must verify your email before using forgot password. Please verify your email in your profile first.');
    }
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    const baseUrl = process.env.APP_URL || process.env.FRONTEND_URL || 'http://localhost';
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: token,
        passwordResetExpires: expires,
      },
    });

    await this.mailService.sendPasswordResetEmail(user.email!, resetUrl);
    return { message: 'Password reset email sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    this.assertMaxLength('Password', newPassword);
    if (!token || typeof token !== 'string' || token.trim().length === 0) {
      throw new BadRequestException('Invalid or expired token');
    }
    if (!newPassword || newPassword.length < 6) {
      throw new BadRequestException('New password must be at least 6 characters');
    }
    const user = await this.prisma.user.findFirst({
      where: { passwordResetToken: token },
    });
    if (!user) throw new BadRequestException('Invalid or expired token');
    if (!user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Token expired');
    }
    if (user.provider === 'google') {
      throw new BadRequestException(
        'This account uses Google sign-in. Please use the Google button on the login page.',
      );
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });
    return { message: 'Password reset successfully' };
  }
  async setupTwoFactor(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { username: true, twoFactorSecret: true },
    });
    if (!user) throw new BadRequestException('User not found');
    const secret = speakeasy.generateSecret({
      name: `ft_transcendence (${user.username})`,
      issuer: process.env.TOTP_ISSUER || 'ft_transcendence',
    });
    const qrCode = await QRCode.toDataURL(secret.otpauth_url!);
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret.base32, twoFactorEnabled: false },
    });
    return { qrCode, secret: secret.base32 };
  }

  async verifyTwoFactorSetup(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorSecret: true },
    });
    if (!user?.twoFactorSecret) throw new BadRequestException('2FA setup not started');
    const valid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 1,
    });
    if (!valid) throw new BadRequestException('Invalid verification code');
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });
    return { message: '2FA enabled' };
  }

  async verifyTwoFactor(tempToken: string, code: string) {
    let payload: { sub?: string; purpose?: string };
    try {
      payload = this.jwtService.verify(tempToken);
    } catch {
      throw new UnauthorizedException('Session expired. Please login again.');
    }
    if (payload.purpose !== '2fa' || !payload.sub) {
      throw new UnauthorizedException('Invalid token');
    }
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, username: true, name: true, twoFactorSecret: true, twoFactorEnabled: true },
    });
    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      throw new UnauthorizedException('Invalid session');
    }
    const valid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 1,
    });
    if (!valid) throw new UnauthorizedException('Invalid verification code');
    const token = this.jwtService.sign({ sub: user.id });
    return { user: { id: user.id, username: user.username, name: user.name }, token };
  }

  async importProfile(userId: string, data: string) {
    const { name, avatar } = this.parseImportData(data);

    const updateData: { name: string; avatar?: string } = { name };

    if (avatar !== undefined) {
      if (avatar.startsWith('data:image/')) {
        const sizeInBytes = Math.ceil((avatar.length * 3) / 4);
        if (sizeInBytes > 5 * 1024 * 1024) {
          throw new BadRequestException('Avatar exceeds 5MB limit');
        }
      } else if (!avatar.startsWith('https://')) {
        throw new BadRequestException('Avatar must be a base64 data URI or HTTPS URL');
      }
      updateData.avatar = avatar;
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, username: true, name: true },
    });

    const restored: string[] = ['name'];
    if (avatar !== undefined) restored.push('avatar');

    return { ...user, restored };
  }

  private parseImportData(data: string): { name: string; avatar?: string } {
    const trimmed = data.trim();

    // JSON
    if (trimmed.startsWith('{')) {
      return this.parseJsonImport(trimmed);
    }
    // XML
    if (trimmed.startsWith('<?xml') || trimmed.startsWith('<export>')) {
      return this.parseXmlImport(trimmed);
    }
    // CSV
    if (trimmed.startsWith('[Profile]')) {
      return this.parseCsvImport(trimmed);
    }

    throw new BadRequestException('Unsupported format. Use JSON, CSV, or XML.');
  }

  private parseJsonImport(data: string): { name: string; avatar?: string } {
    let parsed: unknown;
    try {
      parsed = JSON.parse(data);
    } catch {
      throw new BadRequestException('Invalid JSON');
    }

    if (!parsed || typeof parsed !== 'object') {
      throw new BadRequestException('Invalid data format');
    }

    const root = parsed as Record<string, unknown>;
    const profile = root.profile as Record<string, unknown> | undefined;
    if (!profile || typeof profile !== 'object') {
      throw new BadRequestException('Missing profile field');
    }

    const name = profile.name;
    if (typeof name !== 'string' || name.trim().length === 0 || name.trim().length > 50) {
      throw new BadRequestException('Invalid name (1-50 characters required)');
    }

    const result: { name: string; avatar?: string } = { name: name.trim() };
    if (profile.avatar != null && typeof profile.avatar === 'string' && profile.avatar.length > 0) {
      result.avatar = profile.avatar;
    }
    return result;
  }

  private parseXmlImport(data: string): { name: string; avatar?: string } {
    const nameMatch = data.match(/<profile>[\s\S]*?<name>([\s\S]*?)<\/name>/);
    if (!nameMatch) {
      throw new BadRequestException('Missing <name> in XML profile');
    }
    const name = nameMatch[1]
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"').trim();

    if (name.length === 0 || name.length > 50) {
      throw new BadRequestException('Invalid name (1-50 characters required)');
    }

    const result: { name: string; avatar?: string } = { name };
    const avatarMatch = data.match(/<profile>[\s\S]*?<avatar>([\s\S]*?)<\/avatar>/);
    if (avatarMatch && avatarMatch[1].trim().length > 0) {
      result.avatar = avatarMatch[1]
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"').trim();
    }
    return result;
  }

  private parseCsvImport(data: string): { name: string; avatar?: string } {
    const lines = data.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    const headerIdx = lines.findIndex((l) => l === '[Profile]');
    if (headerIdx === -1 || headerIdx + 2 >= lines.length) {
      throw new BadRequestException('Invalid CSV: missing [Profile] section');
    }

    const headers = this.parseCsvRow(lines[headerIdx + 1]);
    const values = this.parseCsvRow(lines[headerIdx + 2]);
    const nameIdx = headers.indexOf('name');
    if (nameIdx === -1 || nameIdx >= values.length) {
      throw new BadRequestException('Invalid CSV: missing name column');
    }

    const name = values[nameIdx].trim();
    if (name.length === 0 || name.length > 50) {
      throw new BadRequestException('Invalid name (1-50 characters required)');
    }

    return { name };
  }

  private parseCsvRow(row: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < row.length; i++) {
      if (inQuotes) {
        if (row[i] === '"' && row[i + 1] === '"') {
          current += '"';
          i++;
        } else if (row[i] === '"') {
          inQuotes = false;
        } else {
          current += row[i];
        }
      } else if (row[i] === '"') {
        inQuotes = true;
      } else if (row[i] === ',') {
        result.push(current);
        current = '';
      } else {
        current += row[i];
      }
    }
    result.push(current);
    return result;
  }

  async deleteAccount(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, emailVerified: true },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const { email, emailVerified } = user;
    await this.prisma.user.delete({ where: { id: userId } });

    let emailSent = false;
    if (email && emailVerified) {
      emailSent = true;
      this.mailService.sendAccountDeletionNotification(email).catch((err) => {
        console.error('[Auth] Failed to send account deletion email:', err);
      });
    }
    return { message: 'Account deleted successfully', emailSent };
  }

  async disableTwoFactor(userId: string, password: string, code: string) {
    this.assertMaxLength('Password', password);
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { password: true, twoFactorSecret: true, twoFactorEnabled: true },
    });
    if (!user?.twoFactorEnabled || !user.twoFactorSecret) {
      throw new BadRequestException('2FA is not enabled');
    }
    if (!user.password) {
      throw new BadRequestException('Password required to disable 2FA. Use your account password.');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid password');
    }
    const valid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 1,
    });
    if (!valid) throw new BadRequestException('Invalid verification code');
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: null, twoFactorEnabled: false },
    });
    return { message: '2FA disabled' };
  }
}
