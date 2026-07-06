import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { type Repository, type SelectQueryBuilder } from 'typeorm';
import { Client } from '../clients/entities/client.entity';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let clientRepository: jest.Mocked<Repository<Client>>;
  let deletedCountQueryBuilder: jest.Mocked<
    Pick<SelectQueryBuilder<Client>, 'withDeleted' | 'where' | 'getCount'>
  >;
  let totalAccessesQueryBuilder: jest.Mocked<
    Pick<SelectQueryBuilder<Client>, 'withDeleted' | 'select' | 'getRawOne'>
  >;
  let clientsByMonthQueryBuilder: jest.Mocked<
    Pick<
      SelectQueryBuilder<Client>,
      'withDeleted' | 'select' | 'addSelect' | 'where' | 'groupBy' | 'orderBy' | 'getRawMany'
    >
  >;

  const latestClients: Client[] = [
    {
      id: 'client-1',
      name: 'Eduardo',
      email: 'eduardo@example.com',
      phone: null,
      document: null,
      accessCount: 1,
      createdAt: new Date('2026-06-15T00:00:00.000Z'),
      updatedAt: new Date('2026-06-15T00:00:00.000Z'),
      deletedAt: null,
    },
  ];

  beforeEach(async () => {
    deletedCountQueryBuilder = {
      withDeleted: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValue(2),
    };

    totalAccessesQueryBuilder = {
      withDeleted: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({ total: '15' }),
    };

    clientsByMonthQueryBuilder = {
      withDeleted: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([
        { month: '2026-06', total: '4' },
      ]),
    };

    clientRepository = {
      count: jest
        .fn()
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(8),
      find: jest.fn().mockResolvedValue(latestClients),
      createQueryBuilder: jest
        .fn()
        .mockReturnValueOnce(
          deletedCountQueryBuilder as unknown as SelectQueryBuilder<Client>,
        )
        .mockReturnValueOnce(
          totalAccessesQueryBuilder as unknown as SelectQueryBuilder<Client>,
        )
        .mockReturnValueOnce(
          clientsByMonthQueryBuilder as unknown as SelectQueryBuilder<Client>,
        ),
    } as unknown as jest.Mocked<Repository<Client>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: getRepositoryToken(Client),
          useValue: clientRepository,
        },
      ],
    }).compile();

    service = module.get(DashboardService);
  });

  it('returns dashboard totals', async () => {
    const result = await service.getDashboard();

    expect(result.totalClients).toBe(10);
    expect(result.deletedClients).toBe(2);
    expect(result.activeClients).toBe(8);
    expect(result.totalAccesses).toBe(15);
    expect(clientRepository.count).toHaveBeenNthCalledWith(1, {
      withDeleted: true,
    });
    expect(clientRepository.count).toHaveBeenNthCalledWith(2);
  });

  it('returns latest clients', async () => {
    const result = await service.getDashboard();

    expect(clientRepository.find).toHaveBeenCalledWith({
      select: ['id', 'name', 'email', 'createdAt'],
      order: { createdAt: 'DESC' },
      take: 5,
    });
    expect(result.latestClients).toEqual([
      {
        id: 'client-1',
        name: 'Eduardo',
        email: 'eduardo@example.com',
        createdAt: latestClients[0].createdAt,
      },
    ]);
  });

  it('returns grouped statistics by month', async () => {
    const result = await service.getDashboard();

    expect(clientsByMonthQueryBuilder.getRawMany).toHaveBeenCalled();
    expect(result.clientsByMonth).toHaveLength(6);
    expect(
      result.clientsByMonth.find((item) => item.month === '2026-06'),
    ).toEqual({
      month: '2026-06',
      total: 4,
    });
    expect(
      result.clientsByMonth.every((item) => typeof item.total === 'number'),
    ).toBe(true);
  });
});
