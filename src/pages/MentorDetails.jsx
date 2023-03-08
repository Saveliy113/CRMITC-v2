//REACT
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

//REDUX
import { setFetchData } from '../redux/slices/dataSlice';

//COMPONENTS
import RowsSlicer from '../ui/RowsSlicer';
import Pagination from '../ui/Pagination';
import Loader from '../ui/Loader';

//CSS
import styles from '../ui/Table.module.css';
import { useGetCoursesQuery } from '../services/dataApi';

const MentorDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = useSelector((store) => store.data.page);
  const mentorName = searchParams.get('name');
  const mentorId = Number(searchParams.get('id'));

  //-----------------------DATA-------------------------//

  const {
    data: coursesData,
    isSuccess: coursesSuccess,
    isLoading: coursesDataLoading,
  } = useGetCoursesQuery();

  useEffect(() => {
    if (coursesSuccess) {
      dispatch(
        setFetchData({
          page: 'mentor',
          data: coursesData.filter((course) => course.mentor === mentorId),
        })
      );
    }
  }, [coursesSuccess]);

  const courses = useSelector((store) => store.data.currentData);

  //-----------------------TABLE-------------------------//

  const mentorCoursesColumns = ['ID', 'Курс'];

  const mentorCoursesTableTh = mentorCoursesColumns.map((item, index) => (
    <th key={index}>{item}</th>
  ));
  const mentorCoursesTableTr =
    currentPage === 'mentor' && coursesData && courses.length !== 0 ? (
      courses.map((course, index) => (
        <tr key={index} onClick={() => navigate(`/course?id=${course.id}`)}>
          <td data-label="ID">{course.id}</td>
          <td data-label="Курс">{course.title}</td>
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
      <h1>{mentorName}</h1>
      {coursesSuccess ? (
        <>
          <div className="table__actions-box">
            <RowsSlicer />
          </div>
          <div className="table__box">
            <table className={styles.table}>
              <thead>
                <tr>{mentorCoursesTableTh}</tr>
              </thead>
              <tbody>{mentorCoursesTableTr}</tbody>
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

export default MentorDetails;
