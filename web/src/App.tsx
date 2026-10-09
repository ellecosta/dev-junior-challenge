import { useEffect, useState } from 'react';
import { api } from './api';
import { CheckinForm } from './components/CheckinForm';
import { Fila } from './components/Fila';

export interface Checkin {
  id: string;
  cpf: string;
  nome: string;
  dataHoraChegada: string;
}

function App() {
  const [fila, setFila] = useState<Checkin[]>([]);

  const carregarFila = async () => {
    try {
      const { data } = await api.get<Checkin[]>('/checkins');
      setFila(data);
    } catch (error) {
      console.error('Erro ao carregar fila:', error);
      alert('Não foi possível carregar a fila de check-ins.');
    }
  };

  useEffect(() => {
    carregarFila();
  }, []);

  const aoCheckinRealizado = (checkin: Checkin) => {
    setFila((atual) => {
      const novaFila = [...atual, checkin];
      return novaFila.sort(
        (a, b) =>
          new Date(a.dataHoraChegada).getTime() -
          new Date(b.dataHoraChegada).getTime(),
      );
    });
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Check-in de Pacientes</h1>
      <CheckinForm onCheckin={aoCheckinRealizado} onRefresh={carregarFila} />
      <Fila itens={fila} />
    </div>
  );
}

export default App;