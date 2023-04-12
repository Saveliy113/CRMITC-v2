//REACT
import { useNavigate } from 'react-router-dom';

//UTILS
import formatDate from '../../../utils/formatDate';

//ICONS
import { RiPhoneFill } from 'react-icons/ri';

//CSS
import styles from '../../../ui/Table.module.css';

const TrailLessonTable = ({ currentPage, clients }) => {
  const navigate = useNavigate();

  const columns = ['ID', 'Имя', 'Телефон', 'Дата записи'];
  const tableTh = columns.map((item, index) => <th key={index}>{item}</th>);
  const tableTr =
    currentPage === 'trail_lesson' && clients && clients.length !== 0 ? (
      clients?.map((client, index) => (
        <tr key={index} className="clients__table-tr">
          <td data-label="ID">{client.id}</td>

          <td
            className="link"
            data-label="Имя"
            onClick={() => navigate(`/client_details?id=${client.id}`)}
          >
            {client.name}
          </td>
          <td data-label="Телефон">
            <RiPhoneFill id="phone__icon" />
            <a className="link" href={`tel:${client.phone}`}>
              {client.phone}
            </a>
          </td>
          <td data-label="Дата записи">{formatDate(client.create_at)}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={5}>No available data</td>
      </tr>
    );
  return (
    <table className={styles.table}>
      <thead>
        <tr>{tableTh}</tr>
      </thead>
      <tbody>{tableTr}</tbody>
    </table>
  );
};

export default TrailLessonTable;
