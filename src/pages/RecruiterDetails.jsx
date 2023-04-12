//REACT
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

//REDUX
import {
  useGetCoursesQuery,
  useGetStudentsPaymentsQuery,
  useGetStudentsQuery,
} from '../services/dataApi';
import { setFetchData } from '../redux/slices/dataSlice';

//UTILS
import formatDate from '../utils/formatDate';

//ICONS
import { RiArrowDownSFill } from 'react-icons/ri';

//COMPONENTS
import RowsSlicer from '../ui/RowsSlicer';
import Pagination from '../ui/Pagination';
import Loader from '../ui/Loader';

//CSS
import '../css/pages/RecruiterDetails.css';
import styles from '../ui/Table.module.css';
import useErrorHandler from '../hooks/useErrorHandler';

const RecruiterDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeData, setActiveData] = useState('studentsHistory');
  const [searchParams, setSearchParams] = useSearchParams();
  const recruiterId = Number(searchParams.get('id'));
  const recruiterName = searchParams.get('name');

  //-----------------------DATA-------------------------//

  const {
    data: payments,
    isSuccess: paymentsIsSuccess,
    error: paymentsError,
  } = useGetStudentsPaymentsQuery();

  const {
    data: students,
    isSuccess: studentsIsSuccess,
    error: studentsError,
  } = useGetStudentsQuery();

  const {
    data: courses,
    isSuccess: coursesIsSuccess,
    error: coursesError,
  } = useGetCoursesQuery();

  //QUERIES ERRORS HANDLING
  useErrorHandler([paymentsError, studentsError, coursesError]);

  //SETTING DATA TO REDUX

  useEffect(() => {
    if (studentsIsSuccess && activeData === 'studentsHistory') {
      dispatch(
        setFetchData({
          page: 'recruiter_students',
          data: students.filter((student) => student.recruiter === recruiterId),
        })
      );
    }
    if (paymentsIsSuccess && activeData === 'payments') {
      dispatch(
        setFetchData({
          page: 'recruiter_payments',
          data: payments.filter((payment) => payment.recruiter == recruiterId),
        })
      );
    }
  }, [activeData, studentsIsSuccess, paymentsIsSuccess]);

  const currentData = useSelector((store) => store.data.currentData);
  const currentPage = useSelector((store) => store.data.page);

  //----------------------------------------------------//

  //-----------------------TABLE-------------------------//
  console.log(students);
  const studentsHistoryColumns = [
    'ID',
    'Студент',
    'Группа',
    'Оплата',
    'Скидка',
    'Дата',
    'Комментарий',
  ];
  const studentsHistoryTableTh = studentsHistoryColumns.map((item, index) => (
    <th key={index}>{item}</th>
  ));
  const studentsHistoryTableTr =
    currentPage === 'recruiter_students' &&
    courses &&
    currentData.length !== 0 ? (
      currentData.map((student, index) => (
        <tr
          key={index}
          onClick={() => navigate(`/students/student?id=${student.id}`)}
        >
          <td data-label="ID">{student.id}</td>
          <td data-label="Студент">{student.full_name}</td>
          <td data-label="Группа">
            {courses.find((course) => course.id === student.course).title}
          </td>
          <td data-label="Оплата">{`${student.payment.toLocaleString('ru')} ${
            student.currency
          }`}</td>
          <td data-label="Скидка">{student.full_discount}</td>
          <td data-label="Дата">{formatDate(student.create_at)}</td>
          <td data-label="Комментарий">
            {student.comment ? student.comment : '-'}
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={7}>No available data</td>
      </tr>
    );

  const paymentsColumns = ['ID', 'Сумма', 'Студент', 'Дата', 'Комментарий'];
  const paymentsTableTh = paymentsColumns.map((item, index) => (
    <th key={index}>{item}</th>
  ));
  const paymentsTableTr =
    currentPage === 'recruiter_payments' &&
    students &&
    currentData.length !== 0 ? (
      currentData.map((payment, index) => (
        <tr
          key={index}
          onClick={() => navigate(`/payments/payment?id=${payment.id}`)}
        >
          <td data-label="ID">{payment.id}</td>
          <td data-label="Сумма">{payment.sum}</td>
          <td data-label="Студент">
            {
              students.find((student) => student.id === payment.student)
                .full_name
            }
          </td>
          <td data-label="Дата">{formatDate(payment.date)}</td>
          <td data-label="Комментарий">
            {payment.comment ? payment.comment : '-'}
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={5}>No available data</td>
      </tr>
    );

  //----------------------------------------------------//

  return (
    <>
      <div className="recruiter__header">
        <h1>Рекрутер: {recruiterName}</h1>
        <div className="select__container">
          <select
            onChange={(event) => setActiveData(event.target.value)}
            className="select__box"
            value={activeData}
          >
            <option value="studentsHistory">Запись студентов</option>
            <option value="payments">История платежей</option>
          </select>
          <div className="icon__container">
            <RiArrowDownSFill />
          </div>
        </div>
      </div>

      {studentsIsSuccess && coursesIsSuccess ? (
        <>
          <div className="table__actions-box">
            <RowsSlicer />
          </div>
          <div className="table__box">
            <table className={styles.table}>
              <thead>
                <tr>
                  {activeData === 'studentsHistory'
                    ? studentsHistoryTableTh
                    : activeData === 'payments'
                    ? paymentsTableTh
                    : ''}
                </tr>
              </thead>
              <tbody>
                {activeData === 'studentsHistory'
                  ? studentsHistoryTableTr
                  : activeData === 'payments'
                  ? paymentsTableTr
                  : ''}
              </tbody>
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

export default RecruiterDetails;
