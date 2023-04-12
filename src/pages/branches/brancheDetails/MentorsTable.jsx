import { useNavigate } from 'react-router-dom';

//CSS
import styles from '../../../ui/Table.module.css';

const MentorsTable = ({ currentPage, currentData }) => {
  const navigate = useNavigate();

  const columns = ['ID', 'Имя'];
  const tableTh = columns.map((item, index) => <th key={index}>{item}</th>);
  const tableTr =
    currentPage === 'mentors' && currentData && currentData.length !== 0 ? (
      currentData.map((mentor, index) => (
        <tr
          key={index}
          onClick={() =>
            navigate(`/mentor?id=${mentor.id}&name=${mentor.full_name}`)
          }
        >
          <td data-label="ID">{mentor.id}</td>
          <td data-label="Имя">{mentor.full_name}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={2}>No available data</td>
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

export default MentorsTable;
