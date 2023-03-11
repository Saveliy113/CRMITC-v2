//REACT
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

//REDUX
import { setFetchData } from '../redux/slices/dataSlice';
import { useGetCoursesQuery } from '../services/dataApi';

//COMPONENTS
import Loader from '../ui/Loader';
import Pagination from '../ui/Pagination';
import RowsSlicer from '../ui/RowsSlicer';

//CSS
import styles from '../ui/Table.module.css';

const Direction = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = useSelector((store) => store.data.page);

  //-----------------------DATA-------------------------//

  const directionId = Number(searchParams.get('id'));
  const directionTitle = searchParams.get('title');
  const { data: directionData, isSuccess: directionSuccess } =
    useGetCoursesQuery();

  useEffect(() => {
    if (directionSuccess) {
      dispatch(
        setFetchData({
          page: 'direction',
          data: directionData.filter(
            (course) => course.direction === directionId
          ),
        })
      );
    }
  }, [directionSuccess]);

  const directionCourses = useSelector((store) => store.data.currentData);

  //-----------------------TABLE-------------------------//

  const studentsHistoryColumns = [
    'ID',
    'Название',
    'Дата начала',
    'Дата окончания',
  ];

  const directionCoursesTableTh = studentsHistoryColumns.map((item, index) => (
    <th key={index}>{item}</th>
  ));
  const directionCoursesTableTr =
    currentPage === 'direction' &&
    directionData &&
    directionCourses.length !== 0 ? (
      directionCourses.map((course, index) => (
        <tr key={index} onClick={() => navigate(`/course?id=${course.id}`)}>
          <td data-label="ID">{course.id}</td>
          <td data-label="Название">{course.title}</td>
          <td data-label="Дата начала">{course.date_start}</td>
          <td data-label="Дата окончания">{course.finish_date}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={4}>No available data</td>
      </tr>
    );

  //----------------------------------------------------//

  return (
    <>
      <h1>{directionTitle}</h1>
      <h3>Курсы в этом направлении</h3>
      {directionSuccess ? (
        <>
          <div className="table__actions-box">
            <RowsSlicer />
          </div>
          <div className="table__box">
            <table className={styles.table}>
              <thead>
                <tr>{directionCoursesTableTh}</tr>
              </thead>
              <tbody>{directionCoursesTableTr}</tbody>
            </table>
          </div>
          <Pagination />
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Direction;
