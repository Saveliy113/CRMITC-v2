//REACT
import React from 'react';
import { useNavigate } from 'react-router-dom';

//UTILS
import formatDate from '../../../utils/formatDate';

//CSS
import styles from '../../../ui/Table.module.css';

const StudentInfoTable = ({ studentPayments, additionalData: recruiters }) => {
  const navigate = useNavigate();

  const columns = ['ID', 'Сумма', 'Рекрутер', 'Дата', 'Комментарий'];

  const tableTh = columns.map((item, index) => <th key={index}>{item}</th>);
  const tableTr =
    studentPayments && studentPayments.length !== 0 ? (
      studentPayments.map((student, index) => (
        <tr
          key={index}
          onClick={() => navigate(`/payments/payment?id=${student.id}`)}
        >
          <td data-label="ID">{student.id}</td>
          <td data-label="Сумма">{student.sum.toLocaleString('ru')}</td>
          <td data-label="Рекрутер">
            {recruiters?.map((recruiter) =>
              recruiter.id === student.recruiter ? recruiter.username : ''
            )}
          </td>
          <td data-label="Дата">{formatDate(student.date)}</td>
          <td data-label="Комменатарий">
            {student.comment ? student.comment : '-'}
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={5}>No available Data</td>
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

export default StudentInfoTable;
