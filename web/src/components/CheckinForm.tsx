import { useState, type FormEvent } from 'react';
import { api } from '../api';
import type { Checkin } from '../App';

interface Props {
  onCheckin: (checkin: Checkin) => void;
  onRefresh: () => void;
}

export function CheckinForm({ onCheckin, onRefresh }: Props) {
  const [cpf, setCpf] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      setErro('Digite um CPF com 11 dígitos.');
      return;
    }

    setCarregando(true);

    try {
      const { data } = await api.post<Checkin>('/checkins', { cpf: cpfLimpo });
      onCheckin(data);
      setSucesso(`Check-in realizado: ${data.nome}`);
      setCpf('');
      onRefresh();
    } catch (error: any) {
      const mensagem =
        error.response?.status === 404
          ? 'Paciente não encontrado no cadastro.'
          : 'Erro ao realizar check-in. Tente novamente.';
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <section style={{ marginBottom: 32 }}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="cpf" style={{ display: 'block', marginBottom: 8 }}>
          CPF do paciente
        </label>
        <input
          id="cpf"
          type="text"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          placeholder="11111111111"
          maxLength={14}
          style={{ padding: 8, width: '100%', marginBottom: 8 }}
        />
        <button
          type="submit"
          disabled={carregando}
          style={{ padding: '8px 16px', cursor: carregando ? 'not-allowed' : 'pointer' }}
        >
          {carregando ? 'Registrando...' : 'Fazer check-in'}
        </button>
      </form>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      {sucesso && <p style={{ color: 'green' }}>{sucesso}</p>}
    </section>
  );
}