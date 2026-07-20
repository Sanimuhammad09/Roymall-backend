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
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        isEmailVerified: boolean;
        avatar: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateMe(user: any, dto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        isEmailVerified: boolean;
        avatar: string | null;
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
            role: import(".prisma/client").$Enums.Role;
            isEmailVerified: boolean;
            avatar: string | null;
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
    updateStatus(id: string, isActive: boolean): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        isEmailVerified: boolean;
        avatar: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
