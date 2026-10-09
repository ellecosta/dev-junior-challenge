import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosError } from 'axios';
import { CheckinsService } from './checkins.service';
import { CriarCheckinDto } from './dto/criar-checkin.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CheckinsService', () => {
  let service: CheckinsService;

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckinsService,
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    service = module.get<CheckinsService>(CheckinsService);

    (service as any).fila = [];
    mockHttpService.get.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('deve adicionar um check-in válido à fila', async () => {
    const dto: CriarCheckinDto = { cpf: '111.111.111-11' };
    const paciente = {
      cpf: '11111111111',
      nome: 'Ana Souza',
      dataNascimento: '1988-03-12',
    };

    mockHttpService.get.mockReturnValue(of({ data: paciente }));

    const resultado = await service.criar(dto);

    expect(resultado.cpf).toBe('11111111111');
    expect(resultado.nome).toBe('Ana Souza');
    expect(resultado.dataHoraChegada).toBeDefined();
    expect(service.listar()).toHaveLength(1);
  });

  it('deve rejeitar CPF com menos de 11 dígitos', async () => {
    await expect(service.criar({ cpf: '123' })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('deve propagar erro 404 quando o CPF não existe no mock-service', async () => {
    const error = new AxiosError('Not found');
    (error as any).response = { status: 404 };
    mockHttpService.get.mockReturnValue(throwError(() => error));

    await expect(service.criar({ cpf: '99999999999' })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deve listar check-ins ordenados do mais antigo ao mais novo', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-10-09T10:00:00.000Z'));

    const pacientes = [
      {
        cpf: '11111111111',
        nome: 'Ana Souza',
        dataNascimento: '1988-03-12',
      },
      {
        cpf: '22222222222',
        nome: 'Bruno Carvalho',
        dataNascimento: '1975-11-02',
      },
    ];

    mockHttpService.get
      .mockReturnValueOnce(of({ data: pacientes[0] }))
      .mockReturnValueOnce(of({ data: pacientes[1] }));

    const antigo = await service.criar({ cpf: '11111111111' });

    jest.advanceTimersByTime(1);

    const novo = await service.criar({ cpf: '22222222222' });

    const lista = service.listar();
    expect(lista[0].cpf).toBe(antigo.cpf);
    expect(lista[1].cpf).toBe(novo.cpf);
  });

});