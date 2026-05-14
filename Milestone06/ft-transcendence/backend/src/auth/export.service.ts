import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface ExportProfile {
  id: string;
  username: string;
  name: string;
  email: string | null;
  emailVerified: boolean;
  provider: string;
  avatar: string | null;
  createdAt: string;
}

interface ExportGame {
  id: string;
  userScore: number;
  opponentScore: number;
  opponentName: string;
  result: 'win' | 'loss' | 'draw';
  createdAt: string;
}

interface ExportMatch {
  matchId: string;
  mode: string;
  status: string;
  score: number;
  isWinner: boolean;
  endedAt: string | null;
}

interface ExportFriend {
  id: string;
  username: string;
  name: string;
  since: string;
}

interface ExportStats {
  wins: number;
  losses: number;
  total: number;
  winRate: number;
}

export interface ExportData {
  profile: ExportProfile;
  stats: ExportStats;
  games: ExportGame[];
  matches: ExportMatch[];
  friends: ExportFriend[];
  exportedAt: string;
}

@Injectable()
export class ExportService {
  constructor(private readonly prisma: PrismaService) {}

  async getExportData(userId: string): Promise<ExportData> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        emailVerified: true,
        provider: true,
        avatar: true,
        createdAt: true,
        wins: true,
        losses: true,
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
        matchPlayers: {
          select: {
            score: true,
            isWinner: true,
            match: {
              select: {
                id: true,
                mode: true,
                status: true,
                endedAt: true,
              },
            },
          },
        },
        friendRequestsSent: {
          where: { status: 'ACCEPTED' },
          select: {
            createdAt: true,
            addressee: { select: { id: true, username: true, name: true } },
          },
        },
        friendRequestsReceived: {
          where: { status: 'ACCEPTED' },
          select: {
            createdAt: true,
            requester: { select: { id: true, username: true, name: true } },
          },
        },
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const games: ExportGame[] = [
      ...user.gamesAsPlayer1.map((g) => ({
        id: g.id,
        userScore: g.player1Score,
        opponentScore: g.player2Score,
        opponentName: g.player2?.name ?? 'Deleted User',
        result: this.getGameResult(userId, g.winnerId),
        createdAt: g.createdAt.toISOString(),
      })),
      ...user.gamesAsPlayer2.map((g) => ({
        id: g.id,
        userScore: g.player2Score,
        opponentScore: g.player1Score,
        opponentName: g.player1?.name ?? 'Deleted User',
        result: this.getGameResult(userId, g.winnerId),
        createdAt: g.createdAt.toISOString(),
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const matches: ExportMatch[] = user.matchPlayers.map((mp) => ({
      matchId: mp.match.id,
      mode: mp.match.mode,
      status: mp.match.status,
      score: mp.score,
      isWinner: mp.isWinner,
      endedAt: mp.match.endedAt?.toISOString() ?? null,
    }));

    const friends: ExportFriend[] = [
      ...user.friendRequestsSent.map((f) => ({
        id: f.addressee.id,
        username: f.addressee.username,
        name: f.addressee.name,
        since: f.createdAt.toISOString(),
      })),
      ...user.friendRequestsReceived.map((f) => ({
        id: f.requester.id,
        username: f.requester.username,
        name: f.requester.name,
        since: f.createdAt.toISOString(),
      })),
    ];

    const total = user.wins + user.losses;

    return {
      profile: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        provider: user.provider,
        avatar: user.avatar,
        createdAt: user.createdAt.toISOString(),
      },
      stats: {
        wins: user.wins,
        losses: user.losses,
        total,
        winRate: total > 0 ? Math.round((user.wins / total) * 100) : 0,
      },
      games,
      matches,
      friends,
      exportedAt: new Date().toISOString(),
    };
  }

  toJson(data: ExportData): string {
    return JSON.stringify(data, null, 2);
  }

  toCsv(data: ExportData): string {
    const sections: string[] = [];

    sections.push('[Profile]');
    sections.push(this.csvRow(['id', 'username', 'name', 'email', 'emailVerified', 'provider', 'createdAt']));
    sections.push(this.csvRow([
      data.profile.id, data.profile.username, data.profile.name,
      data.profile.email ?? '', String(data.profile.emailVerified),
      data.profile.provider, data.profile.createdAt,
    ]));

    sections.push('');
    sections.push('[Stats]');
    sections.push(this.csvRow(['wins', 'losses', 'total', 'winRate']));
    sections.push(this.csvRow([
      String(data.stats.wins), String(data.stats.losses),
      String(data.stats.total), String(data.stats.winRate),
    ]));

    sections.push('');
    sections.push('[Games]');
    sections.push(this.csvRow(['id', 'userScore', 'opponentScore', 'opponentName', 'result', 'createdAt']));
    for (const g of data.games) {
      sections.push(this.csvRow([
        g.id, String(g.userScore), String(g.opponentScore),
        g.opponentName, g.result, g.createdAt,
      ]));
    }

    sections.push('');
    sections.push('[Matches]');
    sections.push(this.csvRow(['matchId', 'mode', 'status', 'score', 'isWinner', 'endedAt']));
    for (const m of data.matches) {
      sections.push(this.csvRow([
        m.matchId, m.mode, m.status, String(m.score),
        String(m.isWinner), m.endedAt ?? '',
      ]));
    }

    sections.push('');
    sections.push('[Friends]');
    sections.push(this.csvRow(['id', 'username', 'name', 'since']));
    for (const f of data.friends) {
      sections.push(this.csvRow([f.id, f.username, f.name, f.since]));
    }

    return sections.join('\n');
  }

  toXml(data: ExportData): string {
    const lines: string[] = ['<?xml version="1.0" encoding="UTF-8"?>', '<export>'];
    lines.push(this.xmlObject('profile', data.profile));
    lines.push(this.xmlObject('stats', data.stats));
    lines.push('  <games>');
    for (const g of data.games) {
      lines.push(this.xmlObject('game', g, 4));
    }
    lines.push('  </games>');
    lines.push('  <matches>');
    for (const m of data.matches) {
      lines.push(this.xmlObject('match', m, 4));
    }
    lines.push('  </matches>');
    lines.push('  <friends>');
    for (const f of data.friends) {
      lines.push(this.xmlObject('friend', f, 4));
    }
    lines.push('  </friends>');
    lines.push(`  <exportedAt>${this.xmlEscape(data.exportedAt)}</exportedAt>`);
    lines.push('</export>');
    return lines.join('\n');
  }

  private getGameResult(userId: string, winnerId: string | null): 'win' | 'loss' | 'draw' {
    if (!winnerId) return 'draw';
    return winnerId === userId ? 'win' : 'loss';
  }

  private csvEscape(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  private csvRow(values: string[]): string {
    return values.map((v) => this.csvEscape(v)).join(',');
  }

  private xmlEscape(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  private xmlObject(tag: string, obj: object, indent = 2): string {
    const pad = ' '.repeat(indent);
    const innerPad = ' '.repeat(indent + 2);
    const entries = Object.entries(obj as Record<string, unknown>).map(([key, val]) => {
      const strVal = val === null || val === undefined ? '' : String(val);
      return `${innerPad}<${key}>${this.xmlEscape(strVal)}</${key}>`;
    });
    return `${pad}<${tag}>\n${entries.join('\n')}\n${pad}</${tag}>`;
  }
}
