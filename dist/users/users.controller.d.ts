import { UsersService } from './users.service';
import { PaginationDto } from '../common/dto/pagination.dto';
declare class UpdateProfileDto {
    firstName?: string;
    lastName?: string;
    avatar?: string;
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(user: any): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phoneNumber: string | null;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateMe(user: any, dto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phoneNumber: string | null;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(query: PaginationDto & {
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
    updateStatus(id: string, isActive: boolean): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phoneNumber: string | null;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
