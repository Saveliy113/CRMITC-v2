//REACT
import { useNavigate } from 'react-router-dom';

//UTILS
import formatDate from '../../utils/formatDate';

//CSS
import styles from '../../ui/Table.module.css';

const DirectionTable = ({ currentPage, directionCourses }) => {
  const navigate = useNavigate();

  const studentsHistoryColumns = [
    'ID',
    'Название',
    'Дата начала',
    'Дата окончания',
  ];

  const tableTh = studentsHistoryColumns.map((item, index) => (
    <th key={index}>{item}</th>
  ));
  const tableTr =
    currentPage === 'direction' && directionCourses.length !== 0 ? (
      directionCourses.map((course, index) => (
        <tr key={index} onClick={() => navigate(`/course?id=${course.id}`)}>
          <td data-label="ID">{course.id}</td>
          <td data-label="Название">{course.title}</td>
          <td data-label="Дата начала">{formatDate(course.date_start)}</td>
          <td data-label="Дата окончания">{formatDate(course.finish_date)}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={4}>No available data</td>
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

export default DirectionTable;
