import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/appointment.dto';
import { AppointmentStatus, Prisma } from '@prisma/client';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async create(dto: CreateAppointmentDto) {
    return this.prisma.appointment.create({
      data: {
        ...dto,
        status: AppointmentStatus.PENDING,
      },
    });
  }

  async findAllAdmin(params: {
    page: number;
    limit: number;
    status?: AppointmentStatus;
    startDate?: Date;
    endDate?: Date;
  }) {
    const { page, limit, status, startDate, endDate } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.AppointmentWhereInput = {
      ...(status && { status }),
      ...(startDate || endDate
        ? {
            date: {
              ...(startDate && { gte: startDate }),
              ...(endDate && { lte: endDate }),
            },
          }
        : {}),
    };

    const [appointments, total] = await Promise.all([
      this.prisma.appointment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return {
      data: appointments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateStatus(id: string, status: AppointmentStatus) {
    const appointment = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appointment) throw new NotFoundException('Appointment not found');

    const updated = await this.prisma.appointment.update({
      where: { id },
      data: { status },
    });

    // Send confirmation email when status changes to CONFIRMED
    if (status === AppointmentStatus.CONFIRMED) {
      this.mailService
        .sendAppointmentConfirmationEmail(
          appointment.email,
          appointment.fullName,
          appointment.serviceType,
          appointment.date,
          appointment.time,
        )
        .catch((err) =>
          console.error('Failed to send appointment confirmation email', err),
        );
    }

    return updated;
  }
}
