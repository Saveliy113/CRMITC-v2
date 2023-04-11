import { useNavigate } from 'react-router-dom';
import styles from '../../ui/Table.module.css';

const BranchesTable = ({ countries, currentPage }) => {
  const navigate = useNavigate();

  const columns = ['ID', 'Страна'];

  const tableTh = columns.map((item, index) => <th key={index}>{item}</th>);
  const tableTr =
    currentPage === 'branches' && countries && countries.length !== 0 ? (
      countries.map((country, index) => (
        <tr
          key={index}
          onClick={() =>
            navigate(`country_details?id=${country.id}&country=${country.name}`)
          }
        >
          <td data-label="id">{country.id}</td>
          <td data-label="Страна">{country.name}</td>
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

export default BranchesTable;
