import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { type Repository } from 'typeorm';
import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';

describe('ClientsService', () => {
  let service: ClientsService;
  let clientRepository: jest.Mocked<Repository<Client>>;

  const client: Client = {
    id: 'client-id',
    name: 'Eduardo',
    email: 'eduardo@example.com',
    phone: '11999999999',
    document: '12345678900',
    accessCount: 2,
    createdAt: new Date('2026-06-01T00:00:00.000Z'),
    updatedAt: new Date('2026-06-02T00:00:00.000Z'),
    deletedAt: null,
  };

  beforeEach(async () => {
    clientRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      increment: jest.fn(),
      softDelete: jest.fn(),
    } as unknown as jest.Mocked<Repository<Client>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getRepositoryToken(Client),
          useValue: clientRepository,
        },
      ],
    }).compile();

    service = module.get(ClientsService);
    jest.clearAllMocks();
  });

  it('creates a client', async () => {
    clientRepository.findOne.mockResolvedValue(null);
    clientRepository.create.mockReturnValue(client);
    clientRepository.save.mockResolvedValue(client);

    const result = await service.create({
      name: client.name,
      email: client.email,
      phone: client.phone ?? undefined,
      document: client.document ?? undefined,
    });

    expect(clientRepository.create).toHaveBeenCalledWith({
      name: client.name,
      email: client.email,
      phone: client.phone,
      document: client.document,
    });
    expect(result).toEqual({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      document: client.document,
      accessCount: client.accessCount,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    });
  });

  it('throws when creating a client with duplicate email', async () => {
    clientRepository.findOne.mockResolvedValue(client);

    await expect(
      service.create({
        name: 'Another',
        email: client.email,
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('updates a client', async () => {
    const updatedClient = {
      ...client,
      name: 'Eduardo Updated',
    };

    clientRepository.findOne.mockResolvedValueOnce(client).mockResolvedValueOnce(null);
    clientRepository.save.mockResolvedValue(updatedClient);

    const result = await service.update(client.id, {
      name: 'Eduardo Updated',
    });

    expect(clientRepository.save).toHaveBeenCalledWith({
      ...client,
      name: 'Eduardo Updated',
    });
    expect(result.name).toBe('Eduardo Updated');
  });

  it('throws when updating to an email already used by another client', async () => {
    const anotherClient = {
      ...client,
      id: 'another-client-id',
      email: 'another@example.com',
    };

    clientRepository.findOne
      .mockResolvedValueOnce(client)
      .mockResolvedValueOnce(anotherClient);

    await expect(
      service.update(client.id, {
        email: anotherClient.email,
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('soft deletes a client', async () => {
    clientRepository.findOne.mockResolvedValue(client);
    clientRepository.softDelete.mockResolvedValue({
      affected: 1,
      raw: [],
      generatedMaps: [],
    });

    await service.remove(client.id);

    expect(clientRepository.softDelete).toHaveBeenCalledWith(client.id);
  });

  it('returns a client and increments access count', async () => {
    const updatedClient = {
      ...client,
      accessCount: 3,
    };

    clientRepository.findOne
      .mockResolvedValueOnce(client)
      .mockResolvedValueOnce(updatedClient);
    clientRepository.increment.mockResolvedValue({
      affected: 1,
      raw: [],
      generatedMaps: [],
    });

    const result = await service.findOne(client.id);

    expect(clientRepository.increment).toHaveBeenCalledWith(
      { id: client.id },
      'accessCount',
      1,
    );
    expect(result.accessCount).toBe(3);
  });

  it('throws when client is not found', async () => {
    clientRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne('missing-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
