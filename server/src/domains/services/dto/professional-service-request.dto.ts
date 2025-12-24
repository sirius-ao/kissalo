import { ApiProperty } from "@nestjs/swagger"
import { ApprovalStatus } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class ProfessionalServiceRequestDto {
    @IsEnum(ApprovalStatus)
    @ApiProperty({
        description: 'Status da solicitação de serviço',
        example: 'PENDING',
        enum: ApprovalStatus,
    })
    @IsNotEmpty()
    status: ApprovalStatus

    @ApiProperty({
        description: 'Notas adicionais do administrador sobre a solicitação',
        example: 'Revisar portfólio antes da aprovação',
    })
    @IsOptional()
    @IsString()
    adminNotes?: string
}