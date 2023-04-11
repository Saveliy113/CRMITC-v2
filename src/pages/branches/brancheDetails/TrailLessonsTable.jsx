import { useNavigate } from 'react-router-dom';

//CSS
import styles from '../../../ui/Table.module.css';

const TrailLessonsTable = ({ currentPage, currentData, additionalData }) => {
  const navigate = useNavigate();

  const columns = ['ID', 'Заголовок', 'Дата', 'Количество участников'];
  const tableTh = columns.map((item, index) => <th key={index}>{item}</th>);
  const tableTr =
    currentPage === 'trail_lessons' &&
    currentData &&
    currentData.length !== 0 ? (
      currentData.map((lesson, index) => (
        <tr
          key={index}
          onClick={() =>
            navigate(`/trail_lessons/trail_lesson?id=${lesson.id}`)
          }
        >
          <td data-label="ID">{lesson.id}</td>
          <td data-label="Заголовок">{lesson.title}</td>
          <td data-label="Дата">
            {new Date(lesson.date).toLocaleString().slice(0, -3)}
          </td>
          <td data-label="Количество участников">
            {
              additionalData.filter(
                (client) => client.trail_lesson === lesson.id
              ).length
            }
          </td>
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

export default TrailLessonsTable;
