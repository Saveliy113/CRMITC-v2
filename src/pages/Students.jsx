//REACT
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

//REDUX
import {
  useAddStudentMutation,
  useGetCoursesQuery,
  useGetDirectionsQuery,
  useGetStudentsQuery,
  useGetUsersQuery,
} from '../services/dataApi';
import { setFetchData } from '../redux/slices/dataSlice';

//COMPONENTS
import { ToastContainer, toast } from 'react-toastify';
import { CSSTransition } from 'react-transition-group';
import ReactInputMask from 'react-input-mask';
import Pagination from '../ui/Pagination';
import RowsSlicer from '../ui/RowsSlicer';
import Search from '../ui/Search';
import Loader from '../ui/Loader';
import Button from '../ui/Button';
import ModalWindow from '../components/ModalWindow';
import ModalLoader from '../ui/ModalLoader';

//ICONS
import {
  RiCheckFill,
  RiCloseFill,
  RiArrowDownSFill,
  RiRestartLine,
} from 'react-icons/ri';

//CSS
import '../css/pages/Students.css';
import styles from '../ui/Table.module.css';
import '../css/components/ModalWindow.css';
import '../ui/Select.css';
import 'react-toastify/dist/ReactToastify.css';

const Students = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentPage = useSelector((store) => store.data.page);

  //-----------------------FILTERING BY COURSE-------------------------//

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
  } = useGetStudentsQuery();
  const { data: recruiters, isSuccess: recruiterIsSuccess } =
    useGetUsersQuery();
  const { data: courses, isSuccess: coursesIsSuccess } = useGetCoursesQuery();
  const { data: directions, isSuccess: directionsIsSuccess } =
    useGetDirectionsQuery();

  useEffect(() => {
    if (studentsIsSuccess && !filterByCourses) {
      dispatch(
        setFetchData({
          page: 'students',
          data: data.filter((student) => student.studies),
        })
      );
    }
  }, [studentsIsSuccess, filterByCourses]);

  const students = useSelector((store) => store.data.currentData);

  //----------------------------------------------------//

  //---------------- MODAL WINDOW ------------------//

  const [isOpened, setIsOpened] = useState(false);
  const [reqBody, setReqBody] = useState({
    full_name: '',
    start_mount: '',
    email: '',
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

  const notifySuccess = (text) =>
    toast.success(text, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: 'light',
    });

  const notifyError = (error) =>
    toast.error(`????????????. ${error.data.detail}`, {
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
    if (addStudentIsSuccess) {
      setReqBody({
        full_name: '',
        start_mount: '',
        email: '',
        discount: '',
        discount_of_cash: '',
        phone: '',
        course: 0,
        studies: false,
        recruiter: 0,
        contract: false,
        comment: '',
      });
      notifySuccess('?????????????? ?????????????? ????????????????!');
      setTimeout(() => navigate(`/students/student?id=${newStudent.id}`), 1500);
    } else if (addStudentIsError) {
      notifyError(addStudentError);
    }
  }, [addStudentIsSuccess, addStudentIsError]);

  //-----------------------------------------------//

  //-----------------------TABLE-------------------------//

  const columns = [
    'ID',
    '??????',
    '????????????',
    '?????????? ??????????',
    '?????????????? ???? ?????????????? ??????????',
    '????????????????',
    '??????????????',
  ];
  const tableTh = columns.map((item, index) => <th key={index}>{item}</th>);
  const tableTr =
    currentPage === 'students' && students && students.length !== 0 ? (
      students.map((student, index) => (
        <tr key={index} onClick={() => navigate(`student?id=${student.id}`)}>
          <td data-label="ID">{student.id}</td>
          <td data-label="??????">{student.full_name}</td>
          <td data-label="????????????">{student.payment.toLocaleString('ru')}</td>
          <td data-label="?????????? ??????????">
            {student.full_payment.toLocaleString('ru')}
          </td>
          <td data-label="?????????????? ???? ?????????????? ??????????">
            {student.remainder_for_current_mount.toLocaleString('ru')}
          </td>
          <td data-label="????????????????">
            {recruiterIsSuccess
              ? recruiters.map((recruiter) =>
                  recruiter.id === student.recruiter ? recruiter.username : ''
                )
              : ''}
          </td>
          <td data-label="??????????????">
            {student.contract ? <RiCheckFill /> : <RiCloseFill />}
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={7}>No available data</td>
      </tr>
    );

  //----------------------------------------------------//

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
            title="???????????????? ????????????????"
          >
            <div className="modal__inputs">
              <div className="modal__input-container">
                <label htmlFor="name">??????</label>
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
                <label htmlFor="month">?????????? ????????????</label>
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
                <label htmlFor="discount">????????????</label>
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
                      <option value="??????????">??????????</option>
                    </select>
                    <div className="icon__container">
                      <RiArrowDownSFill />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal__input-container">
                <label htmlFor="phone">??????????????</label>
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
                <label htmlFor="course">????????</label>
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
                      ???????????????? ????????
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
                <label htmlFor="studies">????????????</label>
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
                <label htmlFor="name">????????????????</label>
                <div className="select__container">
                  <select
                    onChange={(event) =>
                      setReqBody({ ...reqBody, recruiter: event.target.value })
                    }
                    className="select__box"
                    value={reqBody.recruiter}
                  >
                    <option hidden selected>
                      ???????????????? ??????????????????
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
                <label htmlFor="contract">??????????????</label>
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
                <label htmlFor="comment">??????????????????????</label>
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
                  text="????????????????"
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

      {studentsIsSuccess && directionsIsSuccess ? ( //TABLE
        <>
          <div className="table__actions-box">
            <RowsSlicer />
            <Button text="+???????????????? ????????????????" action={onClickClose} />
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
                    ???????????????? ????????
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
              <Button
                text={<RiRestartLine />}
                action={() => setFilterByCourses('')}
              ></Button>
            </div>

            <Search placeholder="?????? ????????????????" />
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
