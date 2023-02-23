import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RiCheckFill, RiCloseFill, RiArrowDownSFill } from 'react-icons/ri';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  useAddStudentMutation,
  useGetCoursesQuery,
  useGetStudentsQuery,
  useGetUsersQuery,
} from '../services/dataApi';
import { setFetchData } from '../redux/slices/dataSlice';
import Pagination from '../ui/Pagination';
import RowsSlicer from '../ui/RowsSlicer';
import Search from '../ui/Search';
import { CSSTransition } from 'react-transition-group';
import Loader from '../ui/Loader';
import Button from '../ui/Button';
import ModalWindow from '../components/ModalWindow';
import ModalLoader from '../ui/ModalLoader';

import '../css/pages/Students.css';
import styles from '../ui/Table.module.css';
import '../css/components/ModalWindow.css';
import '../ui/Select.css';

const Students = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentPage = useSelector((store) => store.data.page);
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

  const {
    data,
    isSuccess: studentsIsSuccess,
    isLoading,
  } = useGetStudentsQuery();
  const { data: recruiters, isSuccess: recruiterIsSuccess } =
    useGetUsersQuery();
  const { data: courses, isSuccess: coursesIsSuccess } = useGetCoursesQuery();
  console.log('Student loading' + isLoading);
  useEffect(() => {
    studentsIsSuccess && dispatch(setFetchData({ page: 'students', data }));
  }, [studentsIsSuccess]);

  const students = useSelector((store) => store.data.currentData);
  const tableTh = columns.map((item, index) => <th key={index}>{item}</th>);
  const tableTr =
    currentPage === 'students' &&
    students &&
    students.map((student, index) => (
      <tr key={index} onClick={() => navigate(`student?id=${student.id}`)}>
        <td data-label="ID">{student.id}</td>
        <td data-label="Имя">{student.full_name}</td>
        <td data-label="Оплата">{student.payment}</td>
        <td data-label="Общая сумма">{student.full_payment}</td>
        <td data-label="Остаток за текущий месяц">
          {student.remainder_for_current_mount}
        </td>
        <td data-label="Рекрутер">
          {recruiterIsSuccess &&
            recruiters.map((recruiter) =>
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
    ));

  //---------------- MODAL WINDOW ------------------//

  const [
    addStudent,
    { isSuccess, isLoading: addStudentLoading, isError, error },
  ] = useAddStudentMutation();
  const [isOpened, setIsOpened] = useState(false);

  const onClickClose = () => {
    setIsOpened(!isOpened);
  };

  const [reqBody, setReqBody] = useState({
    full_name: '',
    start_mount: '',
    email: '',
    discount: '',
    phone: '',
    course: 0,
    studies: false,
    recruiter: 0,
    contract: false,
    comment: '',
  });
  console.log(reqBody);
  const submitHandler = async (event) => {
    await addStudent(reqBody).unwrap();
  };

  const notifySuccess = () =>
    toast.success('Студент успешно добавлен!', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: 'light',
    });

  const notifyError = () =>
    toast.error(`Ошибка ${error.status}. Повторите попытку.`, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: 'light',
    });

  useEffect(() => {
    if (isSuccess) {
      setReqBody({
        full_name: '',
        start_mount: '',
        email: '',
        discount: '',
        phone: '',
        course: 0,
        studies: false,
        recruiter: 0,
        contract: false,
        comment: '',
      });
      notifySuccess();
    } else if (isError) {
      notifyError();
    }
  }, [isSuccess, isError]);

  //-----------------------------------------------//

  return (
    <>
      {coursesIsSuccess && recruiterIsSuccess ? (
        <CSSTransition
          in={isOpened}
          timeout={500}
          classNames={'modal'}
          unmountOnExit
        >
          <ModalWindow
            opened={isOpened}
            action={onClickClose}
            submit={submitHandler}
            title="Добавить студента"
          >
            <div className="modal__inputs">
              <div className="modal__input-container">
                <label htmlFor="name">ФИО</label>
                <input
                  onChange={(event) =>
                    setReqBody({ ...reqBody, full_name: event.target.value })
                  }
                  type="text"
                  id="name"
                  minLength="1"
                  maxLength="255"
                  value={reqBody.full_name}
                />
              </div>
              <div className="modal__input-container">
                <label htmlFor="month">Месяц начала</label>
                <input
                  onChange={(event) =>
                    setReqBody({ ...reqBody, start_mount: event.target.value })
                  }
                  type="number"
                  id="month"
                  maxLength="2"
                  min={1}
                  max={12}
                  value={reqBody.start_mount}
                />
              </div>
              <div className="modal__input-container">
                <label htmlFor="email">Email</label>
                <input
                  onChange={(event) =>
                    setReqBody({ ...reqBody, email: event.target.value })
                  }
                  type="text"
                  id="email"
                  maxLength="255"
                  value={reqBody.email}
                />
              </div>
              <div className="modal__input-container">
                <label htmlFor="discount">Скидка</label>
                <input
                  onChange={(event) =>
                    setReqBody({ ...reqBody, discount: event.target.value })
                  }
                  type="number"
                  id="discount"
                  maxLength="3"
                  min={0}
                  max={100}
                  value={reqBody.discount}
                />
              </div>
              <div className="modal__input-container">
                <label htmlFor="phone">Телефон</label>
                <input
                  onChange={(event) =>
                    setReqBody({ ...reqBody, phone: event.target.value })
                  }
                  type="text"
                  id="phone"
                  maxLength="15"
                  value={reqBody.phone}
                />
              </div>
              <div className="modal__input-container">
                <label htmlFor="course">Курс</label>
                <div className="select__container">
                  <select
                    onChange={(event) =>
                      setReqBody({
                        ...reqBody,
                        course: Number(event.target.value),
                      })
                    }
                    className="select__box"
                    value={reqBody.course}
                  >
                    <option hidden selected>
                      Выберите курс
                    </option>
                    {courses.map((course, i) => (
                      <option key={i} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                  <div className="icon__container">
                    <RiArrowDownSFill />
                  </div>
                </div>
              </div>
              <div className="modal__input-container">
                <label htmlFor="studies">Учится</label>
                <input
                  onChange={(event) =>
                    setReqBody({ ...reqBody, studies: event.target.checked })
                  }
                  type="checkbox"
                  id="studies"
                  maxLength="15"
                  checked={reqBody.studies}
                />
              </div>
              <div className="modal__input-container">
                <label htmlFor="name">Рекрутер</label>
                <div className="select__container">
                  <select
                    onChange={(event) =>
                      setReqBody({ ...reqBody, recruiter: event.target.value })
                    }
                    className="select__box"
                    value={reqBody.recruiter}
                  >
                    <option hidden selected>
                      Выберите рекрутера
                    </option>
                    {recruiters.map((recruiter, i) => (
                      <option key={i} value={recruiter.id}>
                        {recruiter.username}
                      </option>
                    ))}
                  </select>
                  <div className="icon__container">
                    <RiArrowDownSFill />
                  </div>
                </div>
              </div>
              <div className="modal__input-container">
                <label htmlFor="contract">Договор</label>
                <input
                  onChange={(event) =>
                    setReqBody({ ...reqBody, contract: event.target.checked })
                  }
                  type="checkbox"
                  id="contract"
                  maxLength="15"
                  checked={reqBody.contract}
                />
              </div>
              <div className="modal__input-container">
                <label htmlFor="comment">Комментарий</label>
                <textarea
                  onChange={(event) =>
                    setReqBody({ ...reqBody, comment: event.target.value })
                  }
                  id="name"
                  value={reqBody.comment}
                />
              </div>
            </div>
            <ToastContainer />
            <div className="modal__actions">
              {addStudentLoading ? (
                <ModalLoader isLoading={isLoading} />
              ) : (
                <Button
                  id="login__btn"
                  text="Добавить"
                  action={submitHandler}
                  disabled={
                    reqBody.full_name && reqBody.course && reqBody.recruiter
                      ? false
                      : true
                  }
                />
              )}
            </div>
          </ModalWindow>
        </CSSTransition>
      ) : (
        ''
      )}

      {tableTr ? (
        <>
          <div className="table__actions-box">
            <RowsSlicer />
            <Button text="+Добавить студента" action={onClickClose} />
            <Search />
          </div>
          <div className="table__box">
            <table className={styles.table}>
              <thead>
                <tr>{tableTh}</tr>
              </thead>
              <tbody>{tableTr}</tbody>
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

export default Students;
