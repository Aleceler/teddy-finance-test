import { ApiProperty } from '@nestjs/swagger';

export class LatestClientDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  createdAt!: Date;
}

export class ClientsByMonthDto {
  @ApiProperty({ example: '2026-07' })
  month!: string;

  @ApiProperty()
  total!: number;
}

export class DashboardResponseDto {
  @ApiProperty()
  totalClients!: number;

  @ApiProperty()
  deletedClients!: number;

  @ApiProperty()
  activeClients!: number;

  @ApiProperty()
  totalAccesses!: number;

  @ApiProperty({ type: [LatestClientDto] })
  latestClients!: LatestClientDto[];

  @ApiProperty({ type: [ClientsByMonthDto] })
  clientsByMonth!: ClientsByMonthDto[];
}
