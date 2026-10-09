import type { Checkin } from '../App';

interface Props {
  itens: Checkin[];
}

export function Fila({ itens }: Props) {
  return (
    <section>
      <h2>Fila de check-ins</h2>

      {itens.length === 0 ? (
        <p>Nenhum check-in registrado hoje.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {itens.map((item) => (
            <li
              key={item.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: 4,
                padding: 12,
                marginBottom: 8,
              }}
            >
              <strong>{item.nome}</strong>
              <br />
              <small>CPF: {item.cpf}</small>
              <br />
              <small>
                Chegada: {new Date(item.dataHoraChegada).toLocaleString('pt-BR')}
              </small>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}