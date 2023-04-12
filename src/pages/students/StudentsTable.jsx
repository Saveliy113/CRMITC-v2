import { useNavigate } from 'react-router-dom';
import { RiCheckFill, RiCloseFill } from 'react-icons/ri';

//CSS
import styles from '../../ui/Table.module.css';

const StudentsTable = ({ currentPage, students, additionalData }) => {
  const navigate = useNavigate();

  const { recruiters, courses } = additionalData;
  const columns = [
    'ID',
    'Имя',
    'Курс',
    'Скидка',
    'Остаток за текущий месяц',
    'Рекрутер',
    'Договор',
  ];
  const tableTh = columns.map((item, index) => <th key={index}>{item}</th>);
  const tableTr =
    currentPage === 'students' && students && students.length !== 0 ? (
      students.map((student, index) => (
        <tr key={index} onClick={() => navigate(`student?id=${student.id}`)}>
          <td data-label="ID">{student.id}</td>
          <td data-label="Имя">{student.full_name}</td>
          <td data-label="Курс">
            {courses?.find((course) => student.course === course.id).title}
          </td>
          <td data-label="Скидка">{student.full_discount}</td>
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
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={7}>No available data</td>
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

export default StudentsTable;
