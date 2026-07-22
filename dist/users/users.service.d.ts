import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findByIdOrThrow(id: string): Promise<User>;
    update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
    updatePassword(id: string, newPassword: string): Promise<User>;
    updateStatus(id: string, isActive: boolean): Promise<User>;
    validatePassword(user: User, password: string): Promise<boolean>;
    findAll(params: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        data: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phoneNumber: string | null;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOneAdmin(id: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phoneNumber: string | null;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        addresses: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string | null;
            street: string;
            city: string;
            state: string;
            country: string;
            zipCode: string;
            isDefault: boolean;
            userId: string;
        }[];
        orders: {
            id: string;
            createdAt: Date;
            orderNumber: string;
            totalAmount: number;
            status: import(".prisma/client").$Enums.OrderStatus;
        }[];
    }>;
}
