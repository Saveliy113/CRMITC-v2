//REACT
import { useNavigate } from 'react-router-dom';

//UTILS
import formatDate from '../../utils/formatDate';

//CSS
import styles from '../../ui/Table.module.css';

const PaymentsTable = ({ currentPage, payments, additionalData }) => {
  const navigate = useNavigate();

  const { students, recruiters } = additionalData;
  const columns = ['ID', 'Имя', 'Сумма', 'Рекрутер', 'Дата', 'Комментарий'];

  const tableTh = columns.map((item, index) => <th key={index}>{item}</th>);
  const tableTr =
    currentPage === 'payments' && payments && payments.length !== 0 ? (
      payments.map((payment, index) => (
        <tr key={index} onClick={() => navigate(`payment?id=${payment.id}`)}>
          <td data-label="ID">{payment.id}</td>
          <td data-label="Имя">
            {students?.map((student) =>
              student.id === payment.student ? student.full_name : ''
            )}
          </td>
          <td data-label="Сумма">{payment.sum.toLocaleString('ru')}</td>
          <td data-label="Рекрутер">
            {recruiters?.map((recruiter) =>
              recruiter.id === payment.recruiter ? recruiter.username : ''
            )}
          </td>
          <td data-label="Дата">{formatDate(payment.date)}</td>
          <td data-label="Комментарий">
            {payment.comment ? payment.comment : '-'}
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={6}>No available data</td>
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

export default PaymentsTable;
