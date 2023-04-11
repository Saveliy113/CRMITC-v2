import React from 'react';
import { useNavigate } from 'react-router-dom';

//CSS
import styles from '../../../ui/Table.module.css';

const DirectionsTable = ({ currentPage, currentData }) => {
  const navigate = useNavigate();
  const columns = ['ID', 'Направление'];

  const tableTh = columns.map((item, index) => <th key={index}>{item}</th>);
  const tableTr =
    currentPage === 'directions' && currentData && currentData.length !== 0 ? (
      currentData.map((direction, index) => (
        <tr
          key={index}
          onClick={() =>
            navigate(`/direction?id=${direction.id}&title=${direction.title}`)
          }
        >
          <td data-label="ID">{direction.id}</td>
          <td data-label="Направление">{direction.title}</td>
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

export default DirectionsTable;
