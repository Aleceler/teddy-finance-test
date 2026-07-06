import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../clients/entities/client.entity';
import {
  ClientsByMonthDto,
  DashboardResponseDto,
  LatestClientDto,
} from './dto/dashboard-response.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async getDashboard(): Promise<DashboardResponseDto> {
    const [
      totalClients,
      deletedClients,
      activeClients,
      totalAccesses,
      latestClients,
      clientsByMonth,
    ] = await Promise.all([
      this.clientRepository.count({ withDeleted: true }),
      this.clientRepository
        .createQueryBuilder('client')
        .withDeleted()
        .where('client.deletedAt IS NOT NULL')
        .getCount(),
      this.clientRepository.count(),
      this.getTotalAccesses(),
      this.getLatestClients(),
      this.getClientsByMonth(),
    ]);

    return {
      totalClients,
      deletedClients,
      activeClients,
      totalAccesses,
      latestClients,
      clientsByMonth,
    };
  }

  private async getTotalAccesses(): Promise<number> {
    const result = await this.clientRepository
      .createQueryBuilder('client')
      .withDeleted()
      .select('COALESCE(SUM(client.accessCount), 0)', 'total')
      .getRawOne<{ total: string }>();

    return Number(result?.total ?? 0);
  }

  private async getLatestClients(): Promise<LatestClientDto[]> {
    const clients = await this.clientRepository.find({
      select: ['id', 'name', 'email', 'createdAt'],
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return clients.map((client) => ({
      id: client.id,
      name: client.name,
      email: client.email,
      createdAt: client.createdAt,
    }));
  }

  private async getClientsByMonth(): Promise<ClientsByMonthDto[]> {
    const months = this.getLastSixMonths();
    const startDate = new Date(`${months[0]}-01T00:00:00.000Z`);

    const rows = await this.clientRepository
      .createQueryBuilder('client')
      .withDeleted()
      .select("TO_CHAR(client.createdAt, 'YYYY-MM')", 'month')
      .addSelect('COUNT(*)::int', 'total')
      .where('client.createdAt >= :startDate', { startDate })
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany<{ month: string; total: string }>();

    const totalsByMonth = new Map(
      rows.map((row) => [row.month, Number(row.total)]),
    );

    return months.map((month) => ({
      month,
      total: totalsByMonth.get(month) ?? 0,
    }));
  }

  private getLastSixMonths(): string[] {
    const months: string[] = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.push(month);
    }

    return months;
  }
}
