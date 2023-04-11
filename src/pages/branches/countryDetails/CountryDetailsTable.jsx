import { useNavigate } from 'react-router-dom';

//CSS
import styles from '../../../ui/Table.module.css';

const CountryDetailsTable = ({ currentPage, branches }) => {
  const navigate = useNavigate();

  const columns = ['ID', 'Город', 'Адрес'];
  const tableTh = columns.map((item, index) => <th key={index}>{item}</th>);

  const tableTr =
    currentPage === 'branches' && branches && branches.length !== 0 ? (
      branches.map((branche, index) => {
        return (
          <tr
            key={index}
            onClick={() =>
              navigate(`branche_details?id=${branche.id}&data=directions`)
            }
          >
            <td data-label="ID">{branche.id}</td>
            <td data-label="Город">{branche.city}</td>
            <td data-label="Адрес">{branche.address}</td>
          </tr>
        );
      })
    ) : (
      <tr>
        <td colSpan={3}>No available data</td>
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

export default CountryDetailsTable;
