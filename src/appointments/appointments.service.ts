import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/appointment.dto';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAppointmentDto) {
    return this.prisma.appointment.create({
      data: {
        ...dto,
        status: AppointmentStatus.PENDING,
      },
    });
  }

  async findAllAdmin() {
    return this.prisma.appointment.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
