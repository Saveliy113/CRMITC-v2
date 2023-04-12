//REACT
import { useNavigate } from 'react-router-dom';

//ICONS
import { RiCheckFill, RiCloseFill } from 'react-icons/ri';

//CSS
import styles from '../../../ui/Table.module.css';

const CourseInfoTable = ({ courseStudents, additionalData: recruiters }) => {
  const navigate = useNavigate();

  const columns = [
    'ID',
    'Имя',
    'Оплата',
    'Общая сумма',
    'Остаток за текущий месяц',
    'Рекрутер',
    'Договор',
    'Учится',
  ];

  const tableTrClickHandler = (id) => {
    navigate(`/students/student?id=${id}`);
  };

  const tableTh = columns.map((item, index) => <th key={index}>{item}</th>);
  const tableTr =
    courseStudents && courseStudents.length !== 0 ? (
      courseStudents.map((student, index) => (
        <tr key={index} onClick={() => tableTrClickHandler(student.id)}>
          <td data-label="ID">{student.id}</td>
          <td data-label="Имя">{student.full_name}</td>
          <td data-label="Оплата">{student.payment.toLocaleString('ru')}</td>
          <td data-label="Общая сумма">
            {student.full_payment.toLocaleString('ru')}
          </td>
          <td data-label="Остаток за текущий месяц">
            {student.remainder_for_current_mount.toLocaleString('ru')}
          </td>
          <td data-label="Рекрутер">
            {recruiters?.map((recruiter) =>
              recruiter.id === student.recruiter ? recruiter.username : ''
            )}
          </td>
          <td data-label="Договор">
            {student.contract ? <RiCheckFill /> : <RiCloseFill />}
          </td>
          <td data-label="Учится">
            {student.studies ? <RiCheckFill /> : <RiCloseFill />}
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={8}>No available data</td>
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

export default CourseInfoTable;
