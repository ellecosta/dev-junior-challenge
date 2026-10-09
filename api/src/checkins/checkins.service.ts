import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { Checkin } from './entities/checkin.entity';
import { CriarCheckinDto } from './dto/criar-checkin.dto';

interface PacienteExterno {
  cpf: string;
  nome: string;
  dataNascimento: string;
}

@Injectable()
export class CheckinsService {
  private fila: Checkin[] = [];

  constructor(private readonly httpService: HttpService) {}

  async criar(dto: CriarCheckinDto): Promise<Checkin> {
    const cpf = this.limparCpf(dto.cpf);

    if (cpf.length !== 11) {
      throw new BadRequestException('CPF deve conter 11 dígitos.');
    }

    if (this.fila.some((checkin) => checkin.cpf === cpf)) {
      throw new ConflictException('Check-in já realizado para este CPF.');
    }

    const paciente = await this.buscarPaciente(cpf);

    const checkin: Checkin = {
      id: this.gerarId(),
      cpf: paciente.cpf,
      nome: paciente.nome,
      dataHoraChegada: new Date().toISOString(),
    };

    this.fila.push(checkin);
    return checkin;
  }

  listar(): Checkin[] {
    return [...this.fila].sort(
      (a, b) =>
        new Date(a.dataHoraChegada).getTime() -
        new Date(b.dataHoraChegada).getTime(),
    );
  }

  private async buscarPaciente(cpf: string): Promise<PacienteExterno> {
    const cadastroUrl = process.env.CADASTRO_URL || 'http://localhost:4000';

    try {
      const response = await firstValueFrom(
        this.httpService.get<PacienteExterno>(
          `${cadastroUrl}/pacientes/${cpf}`,
        ),
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        throw new NotFoundException('Paciente não encontrado no cadastro.');
      }
      throw error;
    }
  }

  private limparCpf(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }

  private gerarId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}
