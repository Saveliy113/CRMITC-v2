import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import StudentCard from '../components/StudentCard';
import Loader from '../ui/Loader';
import ModalLoader from '../ui/ModalLoader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsFillFilePersonFill } from 'react-icons/bs';
import {
  RiWhatsappFill,
  RiTelegramFill,
  RiDeleteBin2Line,
  RiEdit2Line,
  RiArrowDownSFill,
  RiArrowGoBackLine,
  RiSave3Fill,
} from 'react-icons/ri';
import {
  MdAttachMoney,
  MdSchool,
  MdEngineering,
  MdContacts,
} from 'react-icons/md';
import {
  useAddPaymentMutation,
  useDeleteStudentMutation,
  useEditStudentMutation,
  useGetCourseByIdQuery,
  useGetCoursesQuery,
  useGetPaymentsByStudentIdQuery,
  useGetStudentByIdQuery,
  useGetUserByIdQuery,
  useGetUsersQuery,
} from '../services/dataApi';
import RowsSlicer from '../ui/RowsSlicer';
import Button from '../ui/Button';
import Search from '../ui/Search';
import Pagination from '../ui/Pagination';
import { setFetchData } from '../redux/slices/dataSlice';
import { CSSTransition } from 'react-transition-group';
import ModalWindow from '../components/ModalWindow';

import styles from '../ui/Table.module.css';
import '../css/pages/StudentInfo.css';

const StudentInfo = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const currentPage = useSelector((store) => store.data.page);

  /*--------------------------DATA----------------------------*/

  const studentId = Number(searchParams.get('id'));
  const [recruiter, setRecruiter] = useState('');
  const [course, setCourse] = useState('');

  const { data: student } = useGetStudentByIdQuery(studentId);
  const { data: recruiters, isSuccess: recruiterIsSuccess } =
    useGetUsersQuery();
  const { data: courses, isSuccess: coursesIsSuccess } = useGetCoursesQuery();

  useEffect(() => {
    if (student && recruiterIsSuccess) {
      setRecruiter(
        recruiters.find((recruiter) => recruiter.id === student.recruiter)
      );
      console.log(recruiters);
    }
    if (student && coursesIsSuccess) {
      setCourse(courses.find((course) => course.id === student.course));
      console.log(courses);
    }
    if (student) {
      setReqBody({
        full_name: student.full_name,
        start_mount: student.start_mount,
        email: student.email,
        discount: student.discount,
        phone: student.phone,
        course: student.course,
        studies: student.studies,
        recruiter: student.recruiter,
        contract: student.contract,
        comment: student.comment ? student.comment : '',
      });
    }
  }, [courses, recruiters, student]);

  /*----------------------------------------------------------*/

  /*------------------------QUERIES-----------------------------*/

  const [reqBody, setReqBody] = useState({});

  const [
    deleteStudent,
    {
      isSuccess: deleteCompleted,
      isLoading: deleteLoading,
      isError: deleteError,
      error,
    },
  ] = useDeleteStudentMutation();

  const [
    editStudent,
    {
      isLoading: editIsLoading,
      isSuccess: editIsSuccess,
      isError: editIsError,
      error: editError,
    },
  ] = useEditStudentMutation();

  const editHandler = () => {
    editStudent({ studentId, reqBody }).unwrap();
  };

  const deleteHandler = () => {
    deleteStudent(studentId);
  };

  /*----------------------------------------------------------*/

  /*-----------------ACTIONS AFTER RESPONSE-------------------*/

  const notifySuccess = (text) =>
    toast.success(`${text}`, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: 'light',
    });

  const notifyError = (err) =>
    toast.error(`Ошибка ${err.status}. Повторите попытку.`, {
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
    if (deleteCompleted) {
      notifySuccess('Студент успешно удален!');
      setTimeout(() => navigate('/students'), 3000);
    }
    if (deleteError) {
      notifyError(error);
    }
  }, [deleteCompleted, deleteError]);

  useEffect(() => {
    if (editIsSuccess) {
      notifySuccess('Изменения внесены успешно!');
      setTimeout(() => setIsEditing(false), 2500);
    }
    if (editIsError) {
      notifyError(editError);
    }
  }, [editIsSuccess, editIsError]);

  /*----------------------------------------------------------*/

  /*------------------------TABLE-----------------------------*/

  const columns = ['ID', 'Сумма', 'Рекрутер', 'Дата', 'Комментарий'];
  const { data: studentPaymentsData, isSuccess: studentPaymentsIsSuccess } =
    useGetPaymentsByStudentIdQuery(studentId);
  console.log(studentPaymentsData);

  useEffect(() => {
    studentPaymentsIsSuccess &&
      dispatch(setFetchData({ page: 'student', data: [studentPaymentsData] }));
  }, [studentPaymentsIsSuccess]);

  const studentPayments = useSelector((store) => store.data.currentData);
  console.log(studentPayments);

  const tableTh = columns.map((item, index) => <th key={index}>{item}</th>);
  const tableTr =
    currentPage === 'student' &&
    studentPayments &&
    studentPayments.map((student, index) => (
      <tr>
        <td data-label="ID">{student.id}</td>
        <td data-label="Сумма">{student.sum}</td>
        <td data-label="Рекрутер">
          {recruiterIsSuccess &&
            recruiters.map((recruiter) =>
              recruiter.id === student.recruiter ? recruiter.username : ''
            )}
        </td>
        <td data-label="Дата">{student.date.slice(0, 10)}</td>
        <td data-label="Комменатарий">
          {student.comment ? student.comment : '-'}
        </td>
      </tr>
    ));

  /*----------------------------------------------------------*/

  /*---------------------MODAL WINDOW-------------------------*/

  const [isOpened, setIsOpened] = useState(false);
  const [paymentReqBody, setPaymentReqBody] = useState({ student: studentId });

  const [
    addPayment,
    {
      isSuccess: addPaymentSuccess,
      isLoading: addPayemntLoading,
      isError: addPaymentIsError,
      error: addPaymentError,
    },
  ] = useAddPaymentMutation();

  const onClickClose = () => {
    setIsOpened(!isOpened);
  };

  const submitHandler = () => {
    addPayment(paymentReqBody).unwrap();
  };

  useEffect(() => {
    if (addPaymentSuccess) {
      setReqBody({ student: studentId });
      notifySuccess('Платеж успешно добавлен!');
    } else if (addPaymentIsError) {
      notifyError(addPaymentError);
    }
  }, [addPaymentSuccess, addPaymentIsError]);

  console.log(paymentReqBody);

  /*----------------------------------------------------------*/

  return student && recruiters && courses ? (
    <>
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
          title="Добавить платеж"
        >
          <div className="modal__inputs">
            <div className="modal__input-container">
              <label htmlFor="phone">Сумма</label>
              <input
                onChange={(event) =>
                  setPaymentReqBody({
                    ...paymentReqBody,
                    sum: event.target.value,
                  })
                }
                type="text"
                id="phone"
                maxLength="15"
                value={paymentReqBody.sum}
              />
            </div>

            <div className="modal__input-container">
              <label htmlFor="name">Рекрутер</label>
              <div className="select__container">
                <select
                  onChange={(event) =>
                    setPaymentReqBody({
                      ...paymentReqBody,
                      recruiter: event.target.value,
                    })
                  }
                  className="select__box"
                  value={paymentReqBody.recruiter}
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
              <label htmlFor="comment">Комментарий</label>
              <textarea
                onChange={(event) =>
                  setReqBody({ ...paymentReqBody, comment: event.target.value })
                }
                id="name"
                value={paymentReqBody.comment}
              />
            </div>
          </div>
          <ToastContainer />
          <div className="modal__actions">
            {addPayemntLoading ? (
              <ModalLoader isLoading={addPayemntLoading} />
            ) : (
              <Button
                id="login__btn"
                text="Добавить"
                action={submitHandler}
                disabled={
                  paymentReqBody.student &&
                  paymentReqBody.sum &&
                  paymentReqBody.recruiter
                    ? false
                    : true
                }
              />
            )}
          </div>
        </ModalWindow>
      </CSSTransition>
      <StudentCard>
        <div className="card">
          <div className="card__header">
            <div className="student__username">
              <BsFillFilePersonFill />
              <h1>{student.full_name}</h1>
            </div>
          </div>
          <div className="card__content">
            {isEditing ? (
              <div className="card__edit-container">
                <RiArrowGoBackLine
                  id="edit__container-back"
                  onClick={() => setIsEditing(false)}
                />
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
                      setReqBody({
                        ...reqBody,
                        start_mount: event.target.value,
                      })
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
                        setReqBody({
                          ...reqBody,
                          recruiter: event.target.value,
                        })
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
            ) : (
              <>
                <div className="card__content-item">
                  <div className="item__icon">
                    <MdSchool />
                  </div>
                  <div className="item__text">
                    <p>{student.studies ? 'Учится' : 'Не учится'}</p>
                    <p onClick={() => navigate(`/course?id=${course.id}`)}>
                      Группа:{' '}
                      <span className="p__link">
                        {course ? course.title : ''}
                      </span>
                    </p>
                    <p>
                      {student.contract ? 'Договор заключен' : 'Нет договора'}
                    </p>
                    <p>Месяц начала: {student.start_mount}</p>
                  </div>
                </div>
                <div className="card__content-item">
                  <div className="item__icon">
                    <MdAttachMoney />
                  </div>
                  <div className="item__text">
                    <p>Скидка: {student.full_discount}</p>
                    <p>Полная сумма: {student.full_payment} KZT</p>
                    <p>Оплата: {student.payment} KZT</p>
                    <p>
                      Остаток за тек. месяц:{' '}
                      {student.remainder_for_current_mount} KZT
                    </p>
                    <p>Остаток всего: {student.remainder} KZT</p>
                  </div>
                </div>
                <div className="card__content-item">
                  <div className="item__icon">
                    <MdEngineering />
                  </div>
                  <div className="item__text">
                    <p>
                      Рекрутер:{' '}
                      <span className="p__link">
                        {recruiter ? recruiter.username : ''}
                      </span>
                    </p>
                    <p>Дата записи: 11.11.2022</p>
                    <p>Комментарий: Нет комментария</p>
                  </div>
                </div>
                <div className="card__content-item">
                  <div className="item__icon">
                    <MdContacts />
                  </div>
                  <div className="item__text">
                    <p>Email: {student.email ? student.email : '-'}</p>
                    <p>Телефон: {student.phone ? student.phone : '-'}</p>
                    {student.whatsapp ? (
                      <a
                        href={student.whatsapp}
                        id="whatsapp__link"
                        target="blank"
                      >
                        <RiWhatsappFill />
                      </a>
                    ) : (
                      ''
                    )}

                    {student.telegram_link ? (
                      <a
                        href={student.telegram_link}
                        id="telegram__link"
                        target="blank"
                      >
                        <RiTelegramFill />
                      </a>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          <ToastContainer />
          <div className="card__footer">
            {deleteLoading || editIsLoading ? (
              <ModalLoader />
            ) : isEditing ? (
              <button
                onClick={editHandler}
                id="edit__container-saveBtn"
                disabled={
                  reqBody.full_name && reqBody.course && reqBody.recruiter
                    ? false
                    : true
                }
              >
                <RiSave3Fill />
              </button>
            ) : (
              <>
                <RiDeleteBin2Line onClick={() => deleteHandler()} />
                <RiEdit2Line onClick={() => setIsEditing(!isEditing)} />
              </>
            )}
          </div>
        </div>
      </StudentCard>
      <div className="table__actions-box">
        <RowsSlicer />
        <Button text="+Добавить платеж" action={onClickClose} />
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
  );
};

export default StudentInfo;
