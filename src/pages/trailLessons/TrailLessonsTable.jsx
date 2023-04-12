//REACT
import { useNavigate } from 'react-router-dom';

//UTILS
import formatDate from '../../utils/formatDate';

//CSS
import styles from '../..//ui/Table.module.css';

const TrailLessonsTable = ({ currentPage, trailLessons, additionalData }) => {
  const navigate = useNavigate();

  const { branches, clients } = additionalData;
  const columns = [
    'ID',
    'Заголовок',
    'Дата',
    'Филиал',
    'Количество участников',
  ];

  //FINDING BRANCH FOR TABLE DATA
  const findBranch = (id) => {
    const branch = branches?.find((branch) => branch.id == id);
    if (branch) {
      return branch.address;
    } else {
      return '-';
    }
  };

  const tableTh = columns.map((item, index) => <th key={index}>{item}</th>);
  const tableTr =
    currentPage === 'trail_lessons' && trailLessons.length !== 0 ? (
      trailLessons.map((lesson, index) => (
        <tr
          key={index}
          onClick={() => navigate(`trail_lesson?id=${lesson.id}`)}
        >
          <td data-label="ID">{lesson.id}</td>
          <td data-label="Заголовок">{lesson.title}</td>
          <td data-label="Дата">{formatDate(lesson.date)}</td>
          <td data-label="Филиал">{findBranch(lesson.branch)}</td>
          <td data-label="Количество участников">
            {
              clients?.filter((client) => client.trail_lesson === lesson.id)
                .length
            }
          </td>
        </tr>
      ))
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

export default TrailLessonsTable;
