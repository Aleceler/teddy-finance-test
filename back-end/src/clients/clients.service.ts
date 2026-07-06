import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientResponseDto } from './dto/client-response.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<ClientResponseDto> {
    const existing = await this.clientRepository.findOne({
      where: { email: createClientDto.email },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException('Client email already exists');
    }

    const client = await this.clientRepository.save(
      this.clientRepository.create(createClientDto),
    );

    return this.toResponse(client);
  }

  async findAll(): Promise<ClientResponseDto[]> {
    const clients = await this.clientRepository.find({
      order: { createdAt: 'DESC' },
    });

    return clients.map((client) => this.toResponse(client));
  }

  async findOne(id: string): Promise<ClientResponseDto> {
    await this.findActiveClient(id);

    await this.clientRepository.increment({ id }, 'accessCount', 1);

    const updated = await this.clientRepository.findOne({ where: { id } });

    if (!updated) {
      throw new NotFoundException('Client not found');
    }

    return this.toResponse(updated);
  }

  async update(
    id: string,
    updateClientDto: UpdateClientDto,
  ): Promise<ClientResponseDto> {
    const client = await this.findActiveClient(id);

    if (updateClientDto.email && updateClientDto.email !== client.email) {
      const existing = await this.clientRepository.findOne({
        where: { email: updateClientDto.email },
        withDeleted: true,
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Client email already exists');
      }
    }

    Object.assign(client, updateClientDto);

    const updated = await this.clientRepository.save(client);

    return this.toResponse(updated);
  }

  async remove(id: string): Promise<void> {
    await this.findActiveClient(id);
    await this.clientRepository.softDelete(id);
  }

  private async findActiveClient(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  private toResponse(client: Client): ClientResponseDto {
    return {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      document: client.document,
      accessCount: client.accessCount,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
