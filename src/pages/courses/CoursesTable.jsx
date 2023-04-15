//REACT
import { useNavigate } from 'react-router-dom';

//UTILS
import formatDate from '../../utils/formatDate';

//CSS
import styles from '../../ui/Table.module.css';

const CoursesTable = ({ currentPage, courses, additionalData }) => {
  const navigate = useNavigate();

  const { branches, mentors } = additionalData;

  const columns = [
    'Филиал',
    'Название курса',
    'Начало',
    'Ментор',
    'Количество студентов',
  ];

  const tableTh = columns.map((item, index) => <th key={index}>{item}</th>);
  const tableTr =
    currentPage === 'courses' && courses && courses.length !== 0 ? (
      courses.map((course, index) => {
        return (
          <tr key={index} onClick={() => navigate(`course?id=${course.id}`)}>
            <td data-label="Филиал">
              {branches.map((branch) =>
                branch.id === course.branch ? branch.address : ''
              )}
            </td>
            <td data-label="Название курса">{course.title}</td>
            <td data-label="Начало">{formatDate(course.date_start)}</td>
            <td data-label="Ментор">
              {mentors.map((mentor) =>
                mentor.id === course.mentor ? mentor.first_name : ''
              )}
            </td>
            <td data-label="Количество студентов">{course.count_students}</td>
          </tr>
        );
      })
    ) : (
      <tr>
        <td colSpan={5}>No available data</td>
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

export default CoursesTable;
