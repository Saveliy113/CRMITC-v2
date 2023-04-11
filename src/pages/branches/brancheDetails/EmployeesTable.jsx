import { useNavigate } from 'react-router-dom';

//CSS
import styles from '../../../ui/Table.module.css';

const EmployeesTable = ({ currentPage, currentData }) => {
  const navigate = useNavigate();

  const columns = ['ID', 'Имя'];
  const tableTh = columns.map((item, index) => <th key={index}>{item}</th>);
  const tableTr =
    currentPage === 'employees' && currentData && currentData.length !== 0 ? (
      currentData.map((employee, index) => (
        <tr
          key={index}
          onClick={() =>
            navigate(`/recruiter?id=${employee.id}&name=${employee.username}`)
          }
        >
          <td data-label="ID">{employee.id}</td>
          <td data-label="Имя">{employee.username}</td>
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

export default EmployeesTable;
