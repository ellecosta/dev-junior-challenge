import type { Checkin } from '../App';

interface Props {
  itens: Checkin[];
}

export function Fila({ itens }: Props) {
  return (
    <section className="card">
      <h2>Fila de check-ins</h2>

      {itens.length === 0 ? (
        <p className="empty-state">Nenhum check-in registrado hoje.</p>
      ) : (
        <ul className="queue-list">
          {itens.map((item, index) => (
            <li key={item.id} className="queue-item">
              <span className="queue-number">{index + 1}</span>

              <div className="patient-info">
                <strong className="patient-name">{item.nome}</strong>

                <span className="patient-detail">CPF: {item.cpf}</span>

                <span className="patient-detail">
                  Chegada:{' '}
                  {new Date(item.dataHoraChegada).toLocaleString('pt-BR')}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
