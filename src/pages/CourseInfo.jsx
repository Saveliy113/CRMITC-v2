//REACT
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

//REDUX
import {
  useGetCourseByIdQuery,
  useGetUsersQuery,
  useGetDirectionsQuery,
  useGetMentorsQuery,
  useAddStudentMutation,
  useDeleteCourseMutation,
  useEditCourseMutation,
} from '../services/dataApi';

//ICONS
import {
  RiTelegramFill,
  RiDeleteBin2Line,
  RiEdit2Line,
  RiArrowDownSFill,
  RiArrowGoBackLine,
  RiSave3Fill,
  RiFileInfoLine,
  RiCalendarEventFill,
  RiCheckFill,
  RiCloseFill,
  RiBookOpenLine,
} from 'react-icons/ri';

//COMPONENTS
import { CSSTransition } from 'react-transition-group';
import { ToastContainer, toast } from 'react-toastify';
import ReactInputMask from 'react-input-mask';
import InfoCard from '../components/InfoCard';
import Loader from '../ui/Loader';
import ModalLoader from '../ui/ModalLoader';
import Button from '../ui/Button';
import ModalWindow from '../components/ModalWindow';

//CSS
import styles from '../ui/Table.module.css';
import '../css/pages/CourseInfo.css';
import 'react-toastify/dist/ReactToastify.css';

const CourseInfo = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const courseId = Number(searchParams.get('id'));
  const [isEditing, setIsEditing] = useState(false);

  /*--------------------------DATA----------------------------*/

  const [mentor, setMentor] = useState('');
  const [direction, setDirection] = useState('');
  const [courseStudents, setCourseStudents] = useState([]);

  const { data: course, isSuccess: courseIsSuccess } =
    useGetCourseByIdQuery(courseId);
  const { data: mentors, isSuccess: mentorsIsSuccess } = useGetMentorsQuery();
  const { data: directions, isSuccess: directionsIsSuccess } =
    useGetDirectionsQuery();
  const { data: recruiters, isSuccess: recruitersIsSuccess } =
    useGetUsersQuery();

  console.log(course);

  useEffect(() => {
    if (course) {
      setCourseStudents(course.student_course);
      setCourseReqBody({
        title: course.title,
        direction: course.direction,
        mentor: course.mentor,
        date_start: course.date_start,
        time_start: course.time_start,
        time_end: course.time_end,
        course_duration: course.course_duration,
        price: course.price,
        description: course.description,
        telegram_group_link: course.telegram_group_link,
        is_active: course.is_active,
      });
    }
    if (course && mentors) {
      setMentor(mentors.find((mentor) => mentor.id === course.mentor));
    }
    if (course && directions) {
      const direction = directions.find(
        (direction) => direction.id === course.direction
      );
      setDirection(direction);
    }
  }, [mentors, course, courseIsSuccess, directions]);

  /*----------------------------------------------------------*/

  /*-----------------COURSE EDITING, DELITING and STUDENT ADDING----------------------*/

  const [courseReqBody, setCourseReqBody] = useState({});
  console.log(courseReqBody);
  const [studentReqBody, setStudentReqBody] = useState({
    full_name: '',
    start_mount: '',
    email: '',
    discount: 0,
    discount_of_cash: 0,
    phone: '',
    whatsapp: '',
    telegram: '',
    course: courseId,
    studies: false,
    recruiter: 0,
    contract: false,
    comment: '',
  });

  const [
    editCourse,
    {
      isLoading: editIsLoading,
      isSuccess: editIsSuccess,
      isError: editIsError,
      error: editError,
    },
  ] = useEditCourseMutation();

  const [
    deleteCourse,
    {
      isSuccess: deleteCompleted,
      isLoading: deleteLoading,
      isError: deleteError,
      error,
    },
  ] = useDeleteCourseMutation();

  const [
    addStudent,
    {
      isSuccess: addStudentSuccess,
      isLoading: addStudentLoading,
      isError: addStudentIsError,
      error: addStudentError,
    },
  ] = useAddStudentMutation();

  let isEditingAllowed = //THIS INPUT FIELDS MUST BE FILLED
    courseReqBody.title &&
    courseReqBody.direction &&
    courseReqBody.date_start &&
    courseReqBody.time_start &&
    courseReqBody.time_end &&
    courseReqBody.course_duration &&
    courseReqBody.price
      ? true
      : false;

  const editHandler = () => {
    editCourse({ courseId, courseReqBody }).unwrap();
  };

  const deleteHandler = () => {
    deleteCourse(courseId);
  };

  /*----------------------------------------------------------*/

  /*-----------------ACTIONS AFTER RESPONSE-------------------*/

  const notifySuccess = (text) =>
    toast.success(`${text}`, {
      position: 'top-center',
      autoClose: 2500,
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
      notifySuccess('Курс успешно удален!');
      setTimeout(() => navigate('/courses'), 500);
    }
    if (deleteError) {
      notifyError(error);
    }
  }, [deleteCompleted, deleteError]);

  useEffect(() => {
    if (editIsSuccess) {
      notifySuccess('Изменения внесены успешно!');
      setTimeout(() => {
        setIsEditing(false);
        window.scrollTo(0, 150);
      }, 500);
    }
    if (editIsError) {
      notifyError(editError);
    }
  }, [editIsSuccess, editIsError]);

  useEffect(() => {
    if (addStudentSuccess) {
      setStudentReqBody({
        full_name: '',
        start_mount: '',
        email: '',
        discount: 0,
        discount_of_cash: 0,
        phone: '',
        whatsapp: '',
        telegram: '',
        course: courseId,
        studies: false,
        recruiter: 0,
        contract: false,
        comment: '',
      });
      notifySuccess('Студент успешно добавлен!');
    } else if (addStudentIsError) {
      notifyError(addStudentError);
    }
  }, [addStudentSuccess, addStudentIsError]);

  /*----------------------------------------------------------*/

  /*---------------------MODAL WINDOW-------------------------*/

  const [isOpened, setIsOpened] = useState(false);
  const discountType = useRef();

  const isSrudentAddAllowed =
    studentReqBody.full_name &&
    studentReqBody.course &&
    studentReqBody.recruiter
      ? true
      : false;

  const onClickClose = () => {
    setIsOpened(!isOpened);
  };

  const addStudentHandler = () => {
    addStudent(studentReqBody).unwrap();
  };

  /*----------------------------------------------------------*/

  /*------------------------TABLE-----------------------------*/

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

  const tableTrClickHandler = (id) => {
    navigate(`/students/student?id=${id}`);
  };

  const tableTh = columns.map((item, index) => <th key={index}>{item}</th>);
  const tableTr =
    courseStudents && courseStudents.length !== 0 ? (
      courseStudents.map((student, index) => (
        <tr key={index} onClick={() => tableTrClickHandler(student.id)}>
          <td data-label="ID">{student.id}</td>
          <td data-label="Имя">{student.full_name}</td>
          <td data-label="Оплата">{student.payment.toLocaleString('ru')}</td>
          <td data-label="Общая сумма">
            {student.full_payment.toLocaleString('ru')}
          </td>
          <td data-label="Остаток за текущий месяц">
            {student.remainder_for_current_mount.toLocaleString('ru')}
          </td>
          <td data-label="Рекрутер">
            {recruitersIsSuccess
              ? recruiters.map((recruiter) =>
                  recruiter.id === student.recruiter ? recruiter.username : ''
                )
              : ''}
          </td>
          <td data-label="Договор">
            {student.contract ? <RiCheckFill /> : <RiCloseFill />}
          </td>
          <td data-label="Учится">
            {student.studies ? <RiCheckFill /> : <RiCloseFill />}
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={8}>No available data</td>
      </tr>
    );

  /*----------------------------------------------------------*/

  return (
    <>
      {recruitersIsSuccess ? (
        <CSSTransition //MODAL WINDOW
          in={isOpened}
          timeout={500}
          classNames={'modal'}
          unmountOnExit
        >
          <ModalWindow
            opened={isOpened}
            action={onClickClose}
            title="Добавить студента"
          >
            <div className="modal__inputs">
              <div className="modal__input-container">
                <label htmlFor="name">ФИО</label>
                <input
                  onChange={(event) =>
                    setStudentReqBody({
                      ...studentReqBody,
                      full_name: event.target.value,
                    })
                  }
                  type="text"
                  id="name"
                  value={studentReqBody.full_name}
                />
              </div>
              <div className="modal__input-container">
                <label htmlFor="month">Месяц начала</label>
                <input
                  onChange={(event) =>
                    setStudentReqBody({
                      ...studentReqBody,
                      start_mount: event.target.value,
                    })
                  }
                  type="number"
                  id="month"
                  maxLength="2"
                  min={1}
                  max={12}
                  value={studentReqBody.start_mount}
                />
              </div>
              <div className="modal__input-container">
                <label htmlFor="email">Email</label>
                <input
                  onChange={(event) =>
                    setStudentReqBody({
                      ...studentReqBody,
                      email: event.target.value,
                    })
                  }
                  type="text"
                  id="email"
                  maxLength="255"
                  value={studentReqBody.email}
                />
              </div>
              <div className="modal__input-container">
                <label htmlFor="discount">Скидка</label>
                <div className="discount__wrapper">
                  <input
                    onChange={(event) =>
                      discountType.current.value === '%'
                        ? setStudentReqBody({
                            ...studentReqBody,
                            discount: Number(event.target.value),
                          })
                        : setStudentReqBody({
                            ...studentReqBody,
                            discount_of_cash: Number(event.target.value),
                          })
                    }
                    type="number"
                    id="discount"
                    value={
                      studentReqBody.discount !== 0 ||
                      studentReqBody.discount_of_cash !== 0
                        ? studentReqBody.discount ||
                          studentReqBody.discount_of_cash
                        : ''
                    }
                  />
                  <div className="select__container">
                    <select
                      ref={discountType}
                      onChange={(event) =>
                        event.target.value === '%'
                          ? setStudentReqBody({
                              ...studentReqBody,
                              discount: studentReqBody.discount_of_cash,
                              discount_of_cash: 0,
                            })
                          : setStudentReqBody({
                              ...studentReqBody,
                              discount_of_cash: studentReqBody.discount,
                              discount: 0,
                            })
                      }
                      className="select__box"
                    >
                      <option value="%">%</option>
                      <option value="сумма">сумма</option>
                    </select>
                    <div className="icon__container">
                      <RiArrowDownSFill />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal__input-container">
                <label htmlFor="phone">Телефон</label>
                <ReactInputMask
                  id="phone"
                  value={studentReqBody.phone}
                  mask="+9999999999999"
                  maskChar={null}
                  onChange={(event) =>
                    setStudentReqBody({
                      ...studentReqBody,
                      phone: event.target.value,
                    })
                  }
                />
              </div>
              <div className="modal__input-container">
                <label htmlFor="whatsapp">Whatsapp</label>
                <ReactInputMask
                  id="whatsapp"
                  value={studentReqBody.whatsapp}
                  mask="+9999999999999"
                  maskChar={null}
                  onChange={(event) =>
                    setStudentReqBody({
                      ...studentReqBody,
                      whatsapp: event.target.value,
                    })
                  }
                />
              </div>
              <div className="modal__input-container">
                <label htmlFor="telegram">Telegram</label>
                <input
                  onChange={(event) =>
                    setStudentReqBody({
                      ...studentReqBody,
                      telegram: event.target.value,
                    })
                  }
                  type="text"
                  id="telegram"
                  maxLength="255"
                  value={studentReqBody.telegram}
                />
              </div>
              <div className="modal__input-container">
                <label htmlFor="studies">Учится</label>
                <input
                  onChange={(event) =>
                    setStudentReqBody({
                      ...studentReqBody,
                      studies: event.target.checked,
                    })
                  }
                  type="checkbox"
                  id="studies"
                  maxLength="15"
                  checked={studentReqBody.studies}
                />
              </div>
              <div className="modal__input-container">
                <label htmlFor="recruiter">Рекрутер</label>
                <div className="select__container">
                  <select
                    onChange={(event) =>
                      setStudentReqBody({
                        ...studentReqBody,
                        recruiter: event.target.value,
                      })
                    }
                    className="select__box"
                    id="recruiter"
                    value={studentReqBody.recruiter}
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
                    setStudentReqBody({
                      ...studentReqBody,
                      contract: event.target.checked,
                    })
                  }
                  type="checkbox"
                  id="contract"
                  maxLength="15"
                  checked={studentReqBody.contract}
                />
              </div>
              <div className="modal__input-container">
                <label htmlFor="comment">Комментарий</label>
                <textarea
                  onChange={(event) =>
                    setStudentReqBody({
                      ...studentReqBody,
                      comment: event.target.value,
                    })
                  }
                  id="comment"
                  value={studentReqBody.comment}
                />
              </div>
            </div>
            <div className="modal__actions">
              {addStudentLoading ? (
                <ModalLoader isLoading={addStudentLoading} />
              ) : (
                <Button
                  text="Добавить"
                  action={addStudentHandler}
                  disabled={!isSrudentAddAllowed}
                />
              )}
            </div>
          </ModalWindow>
        </CSSTransition>
      ) : (
        ''
      )}

      {courseIsSuccess && mentorsIsSuccess && directionsIsSuccess ? (
        <>
          <InfoCard>
            <div className="card">
              <div className="card__header">
                <div className="header__title">
                  <RiBookOpenLine />
                  <h1>{course.title}</h1>
                  <h2
                    onClick={() =>
                      navigate(
                        `/direction?id=${direction.id}&title=${direction.title}`
                      )
                    }
                  >
                    {direction.title}
                  </h2>
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
                      <label htmlFor="title">Название</label>
                      <input
                        onChange={(event) =>
                          setCourseReqBody({
                            ...courseReqBody,
                            title: event.target.value,
                          })
                        }
                        type="text"
                        id="title"
                        minLength="1"
                        maxLength="255"
                        value={courseReqBody.title}
                      />
                    </div>
                    <div className="modal__input-container">
                      <label htmlFor="month">Направление</label>
                      <div className="select__container">
                        <select
                          onChange={(event) =>
                            setCourseReqBody({
                              ...courseReqBody,
                              direction: Number(event.target.value),
                            })
                          }
                          className="select__box"
                          value={courseReqBody.direction}
                        >
                          <option hidden selected>
                            Выберите направление
                          </option>

                          {directions.map((direction, i) => (
                            <option key={i} value={direction.id}>
                              {direction.title}
                            </option>
                          ))}
                        </select>
                        <div className="icon__container">
                          <RiArrowDownSFill />
                        </div>
                      </div>
                    </div>
                    <div className="modal__input-container">
                      <label>Ментор</label>
                      <div className="select__container">
                        <select
                          onChange={(event) =>
                            setCourseReqBody({
                              ...courseReqBody,
                              mentor: Number(event.target.value),
                            })
                          }
                          className="select__box"
                          value={courseReqBody.mentor}
                        >
                          <option hidden selected>
                            Выберите ментора
                          </option>

                          {mentors.map((mentor, i) => (
                            <option key={i} value={mentor.id}>
                              {mentor.full_name}
                            </option>
                          ))}
                        </select>
                        <div className="icon__container">
                          <RiArrowDownSFill />
                        </div>
                      </div>
                    </div>
                    <div className="modal__input-container">
                      <label htmlFor="date_start">Старт группы</label>
                      <input
                        onChange={(event) =>
                          setCourseReqBody({
                            ...courseReqBody,
                            date_start: event.target.value,
                          })
                        }
                        type="date"
                        id="date_start"
                        value={courseReqBody.date_start}
                      />
                    </div>
                    <div className="modal__input-container">
                      <label htmlFor="time_start">Начало занятий</label>
                      <input
                        onChange={(event) =>
                          setCourseReqBody({
                            ...courseReqBody,
                            time_start: event.target.value,
                          })
                        }
                        type="time"
                        id="time_start"
                        value={courseReqBody.time_start}
                      />
                    </div>
                    <div className="modal__input-container">
                      <label htmlFor="time_end">Конец занятий</label>
                      <input
                        onChange={(event) =>
                          setCourseReqBody({
                            ...courseReqBody,
                            time_end: event.target.value,
                          })
                        }
                        type="time"
                        id="time_end"
                        value={courseReqBody.time_end}
                      />
                    </div>
                    <div className="modal__input-container">
                      <label htmlFor="duration">
                        Длительность курса (мес.)
                      </label>
                      <input
                        onChange={(event) =>
                          setCourseReqBody({
                            ...courseReqBody,
                            course_duration: event.target.value,
                          })
                        }
                        id="duration"
                        type="number"
                        value={courseReqBody.course_duration}
                      />
                    </div>
                    <div className="modal__input-container">
                      <label htmlFor="price">Цена</label>
                      <input
                        onChange={(event) =>
                          setCourseReqBody({
                            ...courseReqBody,
                            price: event.target.value,
                          })
                        }
                        type="number"
                        id="price"
                        value={
                          courseReqBody.price
                            ? Math.ceil(courseReqBody.price)
                            : ''
                        }
                      />
                    </div>
                    <div className="modal__input-container">
                      <label htmlFor="telegram">Группа Telegram</label>
                      <input
                        onChange={(event) =>
                          setCourseReqBody({
                            ...courseReqBody,
                            telegram_group_link: event.target.value,
                          })
                        }
                        type="text"
                        id="telegram"
                        value={
                          courseReqBody.telegram_group_link
                            ? courseReqBody.telegram_group_link
                            : ''
                        }
                      />
                    </div>
                    <div className="modal__input-container">
                      <label htmlFor="isActive">Завершен</label>
                      <input
                        onChange={(event) =>
                          setCourseReqBody({
                            ...courseReqBody,
                            is_active: !event.target.checked,
                          })
                        }
                        type="checkbox"
                        id="isActive"
                        checked={!courseReqBody.is_active}
                      />
                    </div>
                    <div className="modal__input-container">
                      <label htmlFor="comment">Описание</label>
                      <textarea
                        onChange={(event) =>
                          setCourseReqBody({
                            ...courseReqBody,
                            description: event.target.value,
                          })
                        }
                        id="course__comment"
                        value={courseReqBody.description}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="card__content-item">
                      <div className="item__icon">
                        <RiFileInfoLine />
                      </div>
                      <div className="item__text">
                        <p>Статус: {course.is_active ? 'идет' : 'завершен'}</p>
                        <p>
                          Длительность: {course.course_duration}
                          {course.course_duration === 1 ? ' месяц' : ' месяца'}
                        </p>
                        <p>Количество студентов: {course.count_students}</p>
                        <p>
                          Ментор:{' '}
                          {mentor ? (
                            <span
                              onClick={() =>
                                navigate(
                                  `/mentor?id=${mentor.id}&name=${mentor.full_name}`
                                )
                              }
                              className="p__link"
                            >
                              {mentor.first_name}
                            </span>
                          ) : (
                            '-'
                          )}
                        </p>
                        <p>Цена: {Math.ceil(course.price)} KZT</p>
                        {course.description ? (
                          <p>Описание: {course.description}</p>
                        ) : (
                          ''
                        )}
                        {course.telegram_group_link ? (
                          <a
                            href={course.telegram_group_link}
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
                    <div className="card__content-item">
                      <div className="item__icon">
                        <RiCalendarEventFill />
                      </div>
                      <div className="item__text">
                        <p>Дата начала: {course.date_start}</p>
                        <p>Дата окончания: {course.finish_date}</p>
                        <p>Сейчас идет: {course.current_month} месяц</p>
                        <p>Следующий месяц начинается: {course.next_month}</p>
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
                    disabled={!isEditingAllowed}
                  >
                    <RiSave3Fill />
                  </button>
                ) : (
                  <>
                    <RiDeleteBin2Line onClick={() => deleteHandler()} />
                    <RiEdit2Line
                      onClick={() => {
                        setIsEditing(!isEditing);
                        window.scrollTo({
                          left: 0,
                          top: 280,
                          behavior: 'smooth',
                        });
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          </InfoCard>

          <div className="table__actions-box">
            <Button text="+Добавить студента" action={onClickClose} />
          </div>
          <div className="table__box">
            <table className={styles.table}>
              <thead>
                <tr>{tableTh}</tr>
              </thead>
              <tbody>{tableTr}</tbody>
            </table>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default CourseInfo;

//student && recruiters && courses && studentPayments
