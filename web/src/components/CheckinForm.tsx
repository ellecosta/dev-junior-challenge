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
      const status = error.response?.status;
      const mensagem =
        status === 404
          ? 'Paciente não encontrado no cadastro.'
          : status === 409
            ? 'Check-in já realizado para este CPF.'
            : 'Erro ao realizar check-in. Tente novamente.';
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <section className="card">
      <h2>Identificação do paciente</h2>

      <form className="checkin-form" onSubmit={handleSubmit}>
        <label htmlFor="cpf">CPF do paciente</label>

        <input
          id="cpf"
          type="text"
          inputMode="numeric"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          placeholder="Digite o CPF do paciente"
          maxLength={14}
        />

        <button type="submit" disabled={carregando}>
          {carregando ? 'Registrando...' : 'Fazer check-in'}
        </button>
      </form>

      {erro && (
        <p className="feedback error" role="alert">
          {erro}
        </p>
      )}

      {sucesso && (
        <p className="feedback success" role="status">
          {sucesso}
        </p>
      )}
    </section>
  );
}
