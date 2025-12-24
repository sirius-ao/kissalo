import PrismaService from "@infra/database/prisma.service";
import { CreateClientDto } from "../dto/create-client.dto";
import { BcryptService } from "@core/shared/utils/services/CryptoService/crypto.service";
import { UserAlreadyExistExecption } from "@core/http/erros/user.error";


export class CreateclientUseCase{

  constructor( 
    private readonly database : PrismaService,
    private readonly encript: BcryptService,
   ) {}

  async create( dto: CreateClientDto ){
    const isAnUser = await this.database.user.findFirst({
      where: {
        OR: [
          {
            email: dto.email,
          },
          {
            phone: dto.phone,
          },
        ],
      },
    });
    if (isAnUser) {
      throw new UserAlreadyExistExecption();
    }

    const password = this.encript.encript(dto.password);
    const client = await this.database.user.create({
      data: {
        ...dto,
        password: password
      },
    });

    return client;
  }
}