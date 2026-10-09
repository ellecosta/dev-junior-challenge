import { Test, TestingModule } from '@nestjs/testing';
import { CheckinsController } from './checkins.controller';
import { CheckinsService } from './checkins.service';

describe('CheckinsController', () => {
  let controller: CheckinsController;

  const mockService = {
    criar: jest.fn(),
    listar: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckinsController],
      providers: [{ provide: CheckinsService, useValue: mockService }],
    }).compile();

    controller = module.get<CheckinsController>(CheckinsController);
    mockService.criar.mockReset();
    mockService.listar.mockReset();
  });

  it('deve chamar service.criar ao fazer POST /checkins', async () => {
    const dto = { cpf: '11111111111' };
    const esperado = {
      id: '1',
      cpf: '11111111111',
      nome: 'Ana Souza',
      dataHoraChegada: '2024-01-01T00:00:00.000Z',
    };
    mockService.criar.mockResolvedValue(esperado);

    const resultado = await controller.criar(dto);

    expect(resultado).toEqual(esperado);
    expect(mockService.criar).toHaveBeenCalledWith(dto);
  });

  it('deve chamar service.listar ao fazer GET /checkins', async () => {
    const esperado = [
      {
        id: '1',
        cpf: '11111111111',
        nome: 'Ana Souza',
        dataHoraChegada: '2024-01-01T00:00:00.000Z',
      },
    ];
    mockService.listar.mockReturnValue(esperado);

    const resultado = await controller.listar();

    expect(resultado).toEqual(esperado);
    expect(mockService.listar).toHaveBeenCalled();
  });
});
