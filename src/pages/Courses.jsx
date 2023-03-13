//REACT
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

//REDUX
import { setFetchData } from '../redux/slices/dataSlice';
import {
  useAddCourseMutation,
  useGetBranchesQuery,
  useGetCoursesQuery,
  useGetDirectionsQuery,
  useGetMentorsQuery,
} from '../services/dataApi';

//ICONS
import { RiArrowDownSFill } from 'react-icons/ri';

//COMPONENTS
import { ToastContainer, toast } from 'react-toastify';
import { CSSTransition } from 'react-transition-group';
import Button from '../ui/Button';
import Pagination from '../ui/Pagination';
import Search from '../ui/Search';
import RowsSlicer from '../ui/RowsSlicer';
import Loader from '../ui/Loader';
import ModalLoader from '../ui/ModalLoader';
import ModalWindow from '../components/ModalWindow';

//CSS
import '../css/pages/Students.css';
import styles from '../ui/Table.module.css';

const Courses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentPage = useSelector((store) => store.data.page);

  //-----------------------DATA-------------------------//

  const { data: coursesData, isSuccess: coursesIsSuccess } =
    useGetCoursesQuery();
  const { data: branches, isSuccess: branchesIsSuccess } =
    useGetBranchesQuery();
  const { data: mentors, isSuccess: mentorsIsSuccess } = useGetMentorsQuery();
  const { data: directions, isSuccess: directionsIsSuccess } =
    useGetDirectionsQuery();

  useEffect(() => {
    coursesIsSuccess &&
      dispatch(
        setFetchData({
          page: 'courses',
          data: coursesData.filter((course) => course.is_active),
        })
      );
  }, [coursesData, coursesIsSuccess]);

  const courses = useSelector((store) => store.data.currentData);

  //----------------------------------------------------//

  //----------------------MODAL WINDOW------------------------//

  const [isOpened, setIsOpened] = useState(false);
  const [courseReqBody, setCourseReqBody] = useState({
    title: '',
    direction: '',
    mentor: '',
    date_start: '',
    time_start: '',
    time_end: '',
    course_duration: '',
    price: '',
    description: '',
    telegram_group_link: '',
    is_active: true,
  });

  const [
    addCourse,
    {
      isSuccess: addCourseSuccess,
      isLoading: addCourseLoading,
      isError: addCourseIsError,
      error: addCourseError,
    },
  ] = useAddCourseMutation();

  const isCourseAddAllowed = //THIS INPUT FIELDS MUST BE FILLED
    courseReqBody.title &&
    courseReqBody.direction &&
    courseReqBody.date_start &&
    courseReqBody.time_start &&
    courseReqBody.time_end &&
    courseReqBody.course_duration &&
    courseReqBody.price
      ? true
      : false;

  const onClickClose = () => {
    setIsOpened(!isOpened);
  };

  const submitHandler = async () => {
    await addCourse(courseReqBody).unwrap();
  };

  //----------------------------------------------------//

  //----------------ACTIONS AFTER QUERY RESPONSE------------------//

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
    toast.error(`Ошибка. ${err.data.detail}`, {
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
    if (addCourseSuccess) {
      setCourseReqBody({
        title: '',
        direction: '',
        mentor: '',
        date_start: '',
        time_start: '',
        time_end: '',
        course_duration: '',
        price: '',
        description: '',
        telegram_group_link: '',
        is_active: true,
      });
      notifySuccess('Курс успешно добавлен');
      setIsOpened(false);
    } else if (addCourseIsError) {
      notifyError(addCourseError);
    }
  }, [addCourseSuccess, addCourseIsError]);

  //----------------------------------------------------//

  //-----------------------TABLE-------------------------//

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
              {branchesIsSuccess
                ? branches.map((branch) =>
                    branch.id === course.branch ? branch.address : ''
                  )
                : ''}
            </td>
            <td data-label="Название курса">{course.title}</td>
            <td data-label="Начало">{course.date_start}</td>
            <td data-label="Ментор">
              {mentorsIsSuccess
                ? mentors.map((mentor) =>
                    mentor.id === course.mentor ? mentor.first_name : ''
                  )
                : ''}
            </td>
            <td data-label="Количество студентов">{course.count_students}</td>
          </tr>
        );
      })
    ) : (
      <tr>
        <td colSpan={4}>No available data</td>
      </tr>
    );

  return (
    <>
      <ToastContainer />
      {directionsIsSuccess && mentorsIsSuccess ? ( //MODAL WINDOW
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
            title="Добавить Курс"
          >
            <div className="modal__inputs">
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
                <label htmlFor="email">Ментор</label>
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
                <label htmlFor="duration">Длительность курса (мес.)</label>
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
                  value={courseReqBody.price}
                />
              </div>
              <div className="modal__input-container">
                <label htmlFor="telegram">Группа Telegram</label>
                <input
                  onChange={(event) =>
                    setCourseReqBody({
                      ...courseReqBody,
                      telegram_froup_link: event.target.value,
                    })
                  }
                  type="text"
                  id="telegram"
                  value={courseReqBody.telegram_group_link}
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
                  id="comment"
                  value={courseReqBody.description}
                />
              </div>
            </div>
            <ToastContainer />
            <div className="modal__actions">
              {addCourseLoading ? (
                <ModalLoader isLoading={addCourseLoading} />
              ) : (
                <Button
                  id="login__btn"
                  text="Добавить"
                  action={submitHandler}
                  disabled={!isCourseAddAllowed}
                />
              )}
            </div>
          </ModalWindow>
        </CSSTransition>
      ) : (
        ''
      )}

      {coursesIsSuccess && branchesIsSuccess && mentorsIsSuccess ? ( //TABLE
        <>
          <div className="table__actions-box">
            <RowsSlicer />
            <Button text="+Добавить курс" action={onClickClose} />

            <Search placeholder="Название курса" />
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
