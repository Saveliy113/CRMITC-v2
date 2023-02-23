import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setFetchData } from '../redux/slices/dataSlice';
import {
  useGetBranchesQuery,
  useGetCoursesQuery,
  useGetMentorsQuery,
} from '../services/dataApi';
import Pagination from '../ui/Pagination';
import Search from '../ui/Search';
import RowsSlicer from '../ui/RowsSlicer';

import '../css/pages/Students.css';
import styles from '../ui/Table.module.css';
import Loader from '../ui/Loader';

const Courses = () => {
  const dispatch = useDispatch();
  const columns = ['Филиал', 'Название курса', 'Начало', 'Ментор'];
  const currentPage = useSelector((store) => store.data.page);

  const { data, isSuccess: coursesIsSuccess } = useGetCoursesQuery();
  const { data: branches, isSuccess: branchesIsSuccess } =
    useGetBranchesQuery();
  const { data: mentors, isSuccess: mentorsIsSuccess } = useGetMentorsQuery();

  useEffect(() => {
    coursesIsSuccess && dispatch(setFetchData({ page: 'courses', data }));
  }, [coursesIsSuccess]);

  const courses = useSelector((store) => store.data.currentData);
  const tableTr =
    currentPage === 'courses' &&
    courses &&
    courses.map((course, index) => {
      return (
        <tr key={index}>
          <td data-label="Филиал">
            {branchesIsSuccess &&
              branches.map((branch) =>
                branch.id === course.branch ? branch.address : ''
              )}
          </td>
          <td data-label="Название курса">{course.title}</td>
          <td data-label="Начало">{course.date_start}</td>
          <td data-label="Ментор">
            {mentorsIsSuccess &&
              mentors.map((mentor) =>
                mentor.id === course.mentor ? mentor.first_name : ''
              )}
          </td>
        </tr>
      );
    });
  const tableTh = columns.map((item, index) => <th key={index}>{item}</th>);

  return (
    <>
      {tableTr ? (
        <>
          <div className="table__actions-box">
            <RowsSlicer />
            <Search />
          </div>
          <div className="table__box">
            <table className={styles.table}>
              <thead>
                <tr>{tableTh}</tr>
              </thead>
              <tbody>{tableTr}</tbody>
            </table>
            <Pagination />
          </div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Courses;
