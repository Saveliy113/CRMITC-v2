//REACT
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useNotify from '../../hooks/useNotify';

//REDUX
import {
  useAddStudentMutation,
  useGetCoursesQuery,
  useGetDirectionsQuery,
  useGetStudentsQuery,
  useGetUsersQuery,
} from '../../services/dataApi';
import {
  filterStudentsByRemainder,
  setFetchData,
} from '../../redux/slices/dataSlice';

//COMPONENTS
import { CSSTransition } from 'react-transition-group';
import StudentsTable from './StudentsTable';
import ReactInputMask from 'react-input-mask';
import Pagination from '../../ui/Pagination';
import RowsSlicer from '../../ui/RowsSlicer';
import Search from '../../ui/Search';
import Loader from '../../ui/Loader';
import Button from '../../ui/Button';
import ModalWindow from '../../components/ModalWindow';
import ModalLoader from '../../ui/ModalLoader';

//ICONS
import { RiArrowDownSFill, RiRestartLine } from 'react-icons/ri';

//CSS
import './Students.css';
import '../../css/components/ModalWindow.css';
import '../../ui/Select.css';
import 'react-toastify/dist/ReactToastify.css';
import useErrorHandler from '../../hooks/useErrorHandler';
import FilterByRemainder from './FilterByRemainder';

const Students = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notify } = useNotify();

  const currentPage = useSelector((store) => store.data.page);

  //-----------------------FILTERING-------------------------//

  const [filterByCourses, setFilterByCourses] = useState('');

  useEffect(() => {
    if (filterByCourses) {
      dispatch(
        setFetchData({
          page: 'students',
          data: data.filter(
            (student) => student.studies && student.course === filterByCourses
          ),
        })
      );
    }
  }, [filterByCourses]);

  //-----------------------DATA-------------------------//

  const {
    data,
    isSuccess: studentsIsSuccess,
    isLoading,
    error: studentsError,
  } = useGetStudentsQuery();

  const {
    data: recruiters,
    isSuccess: recruiterIsSuccess,
    error: recruitersError,
  } = useGetUsersQuery();

  const {
    data: courses,
    isSuccess: coursesIsSuccess,
    error: coursesError,
  } = useGetCoursesQuery();

  const {
    data: directions,
    isSuccess: directionsIsSuccess,
    error: directionsError,
  } = useGetDirectionsQuery();

  const [searchParams, setSearchParams] = useSearchParams();

  //SETTING DATA TO REEDUX
  const setStudentsData = () => {
    dispatch(
      setFetchData({
        page: 'students',
        data: data.filter((student) => student.studies),
      })
    );
  };

  useEffect(() => {
    if (studentsIsSuccess && !filterByCourses) {
      setStudentsData();
    }
  }, [studentsIsSuccess, filterByCourses]);

  //QUERIES ERRORS HANDLING
  useErrorHandler([
    studentsError,
    recruitersError,
    coursesError,
    directionsError,
  ]);

  const students = useSelector((store) => store.data.currentData);

  // console.log(students);

  //----------------------------------------------------//

  //---------------- MODAL WINDOW ------------------//

  const [isOpened, setIsOpened] = useState(false);
  const [reqBody, setReqBody] = useState({
    full_name: '',
    start_mount: '',
    email: '',
    whatsapp: '',
    telegram: '',
    discount: 0,
    discount_of_cash: 0,
    phone: '',
    course: 0,
    studies: false,
    recruiter: 0,
    contract: false,
    comment: '',
  });
  const discountType = useRef();

  const [
    addStudent,
    {
      data: newStudent,
      isSuccess: addStudentIsSuccess,
      isLoading: addStudentLoading,
      isError: addStudentIsError,
      error: addStudentError,
    },
  ] = useAddStudentMutation();

  const onClickClose = () => {
    setIsOpened(!isOpened);
  };

  const submitHandler = async () => {
    await addStudent(reqBody).unwrap();
  };

  //----------------------------------------------------//

  //----------------ACTIONS AFTER QUERY RESPONSE------------------//

  useEffect(() => {
    if (addStudentIsSuccess) {
      setReqBody({
        full_name: '',
        start_mount: '',
        email: '',
        whatsapp: '',
        telegram: '',
        discount: '',
        discount_of_cash: '',
        phone: '',
        course: 0,
        studies: false,
        recruiter: 0,
        contract: false,
        comment: '',
      });
      notify({ message: 'Студент успешно добавлен!', type: 'success' });
      setTimeout(() => navigate(`/students/student?id=${newStudent.id}`), 1500);
    } else if (addStudentIsError) {
      notify({ message: addStudentError, type: 'error' });
    }
  }, [addStudentIsSuccess, addStudentIsError]);

  //-----------------------------------------------//

  return (
    <>
      {coursesIsSuccess && recruiterIsSuccess ? (
        <CSSTransition //MODAL WINDOW
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
                <label htmlFor="whatsapp">Whatsapp</label>
                <ReactInputMask
                  id="whatsapp"
                  value={reqBody.whatsapp}
                  mask="+9999999999999"
                  maskChar={null}
                  onChange={(event) =>
                    setReqBody({ ...reqBody, whatsapp: event.target.value })
                  }
                />
              </div>
              <div className="modal__input-container">
                <label htmlFor="telegram">Telegram</label>
                <input
                  onChange={(event) =>
                    setReqBody({ ...reqBody, telegram: event.target.value })
                  }
                  type="text"
                  id="telegram"
                  maxLength="255"
                  value={reqBody.telegram}
                />
              </div>
              <div className="modal__input-container">
                <label htmlFor="discount">Скидка</label>
                <div className="discount__wrapper">
                  <input
                    onChange={(event) =>
                      discountType.current.value === '%'
                        ? setReqBody({
                            ...reqBody,
                            discount: Number(event.target.value),
                          })
                        : setReqBody({
                            ...reqBody,
                            discount_of_cash: Number(event.target.value),
                          })
                    }
                    type="number"
                    id="discount"
                    value={
                      reqBody.discount !== 0 || reqBody.discount_of_cash !== 0
                        ? reqBody.discount || reqBody.discount_of_cash
                        : ''
                    }
                  />
                  <div className="select__container">
                    <select
                      ref={discountType}
                      onChange={(event) =>
                        event.target.value === '%'
                          ? setReqBody({
                              ...reqBody,
                              discount: reqBody.discount_of_cash,
                              discount_of_cash: 0,
                            })
                          : setReqBody({
                              ...reqBody,
                              discount_of_cash: reqBody.discount,
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
                  value={reqBody.phone}
                  mask="+9999999999999"
                  maskChar={null}
                  onChange={(event) =>
                    setReqBody({ ...reqBody, phone: event.target.value })
                  }
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

      {studentsIsSuccess && directionsIsSuccess && coursesIsSuccess ? ( //TABLE
        <>
          <div className="table__actions-box">
            <RowsSlicer />
            <Button text="+Добавить студента" action={onClickClose} />
            <div id="filter__container">
              <div className="select__container">
                <select
                  onChange={(event) =>
                    setFilterByCourses(Number(event.target.value))
                  }
                  className="select__box"
                  value={filterByCourses}
                >
                  <option hidden selected>
                    Выберите курс
                  </option>
                  {courses
                    .filter((course) => course.is_active)
                    .map((course, i) => (
                      <option key={i} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                </select>
                <div className="icon__container">
                  <RiArrowDownSFill />
                </div>
              </div>
              <Button
                text={<RiRestartLine />}
                action={() => setFilterByCourses('')}
              ></Button>
            </div>

            <FilterByRemainder setInitialData={setStudentsData} />

            <Search placeholder="Имя студента" />
          </div>
          <div className="table__box">
            <StudentsTable
              currentPage={currentPage}
              students={students}
              additionalData={{ recruiters, courses }}
            />
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
