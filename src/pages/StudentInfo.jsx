//REACT
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

//REDUX
import {
  useAddPaymentMutation,
  useDeleteStudentMutation,
  useEditStudentMutation,
  useGetCoursesQuery,
  useGetPaymentsByStudentIdQuery,
  useGetStudentByIdQuery,
  useGetUsersQuery,
} from '../services/dataApi';

//ICONS
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
import { BsFillFilePersonFill } from 'react-icons/bs';

//COMPONENTS
import { ToastContainer, toast } from 'react-toastify';
import InfoCard from '../components/InfoCard';
import ModalWindow from '../components/ModalWindow';
import Loader from '../ui/Loader';
import ModalLoader from '../ui/ModalLoader';
import Button from '../ui/Button';

//CSS
import styles from '../ui/Table.module.css';
import '../css/pages/StudentInfo.css';
import 'react-toastify/dist/ReactToastify.css';

const StudentInfo = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const studentId = Number(searchParams.get('id'));

  /*--------------------------DATA----------------------------*/

  const [recruiter, setRecruiter] = useState('');
  const [course, setCourse] = useState('');

  const { data: student, isSuccess: studentIsSuccess } =
    useGetStudentByIdQuery(studentId);
  const { data: recruiters, isSuccess: recruitersIsSuccess } =
    useGetUsersQuery();
  const { data: courses, isSuccess: coursesIsSuccess } = useGetCoursesQuery();
  const { data: studentPaymentsData, isSuccess: studentPaymentsIsSuccess } =
    useGetPaymentsByStudentIdQuery(studentId);

  useEffect(() => {
    if (student && recruitersIsSuccess) {
      setRecruiter(
        recruiters.find((recruiter) => recruiter.id === student.recruiter)
      );
    }
    if (student && coursesIsSuccess) {
      setCourse(courses.find((course) => course.id === student.course));
    }
    if (studentIsSuccess) {
      setStudentReqBody({
        full_name: student.full_name,
        start_mount: student.start_mount,
        email: student.email,
        discount: student.discount,
        discount_of_cash: student.discount_of_cash,
        phone: student.phone,
        course: student.course,
        studies: student.studies,
        recruiter: student.recruiter,
        contract: student.contract,
        comment: student.comment ? student.comment : '',
      });
    }
  }, [courses, recruiters, student, studentIsSuccess]);

  /*----------------------------------------------------------*/

  /*------------------STUDENT DELITING, EDITING, PAYMENT ADDING-----------------------*/

  const [studentReqBody, setStudentReqBody] = useState({});
  console.log(studentReqBody);

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

  const isStudentEditingAllowed = //THIS INPUT FIELDS MUST BE FILLED
    studentReqBody.full_name &&
    studentReqBody.course &&
    studentReqBody.recruiter
      ? false
      : true;

  const [
    addPayment,
    {
      isSuccess: addPaymentSuccess,
      isLoading: addPayemntLoading,
      isError: addPaymentIsError,
      error: addPaymentError,
    },
  ] = useAddPaymentMutation();

  const editHandler = () => {
    editStudent({ studentId, studentReqBody }).unwrap();
  };

  const deleteHandler = () => {
    deleteStudent(studentId);
  };

  /*----------------------------------------------------------*/

  /*---------------------MODAL WINDOW-------------------------*/

  const [isOpened, setIsOpened] = useState(false);
  const [paymentReqBody, setPaymentReqBody] = useState({ student: studentId });
  const discountType = useRef();

  const onClickClose = () => {
    setIsOpened(!isOpened);
  };

  const addPaymentHandler = () => {
    addPayment(paymentReqBody).unwrap();
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
    toast.error(`???????????? ${err.status}. ?????????????????? ??????????????.`, {
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
      notifySuccess('?????????????? ?????????????? ????????????!');
      setTimeout(() => navigate('/students'), 1500);
    }
    if (deleteError) {
      notifyError(error);
    }
  }, [deleteCompleted, deleteError]);

  useEffect(() => {
    if (editIsSuccess) {
      notifySuccess('?????????????????? ?????????????? ??????????????!');
      setTimeout(() => setIsEditing(false), 2500);
    }
    if (editIsError) {
      notifyError(editError);
    }
  }, [editIsSuccess, editIsError]);

  useEffect(() => {
    if (addPaymentSuccess) {
      setPaymentReqBody({ student: studentId, sum: '', recruiter: '' });
      notifySuccess('???????????? ?????????????? ????????????????!');
    } else if (addPaymentIsError) {
      notifyError(addPaymentError);
    }
  }, [addPaymentSuccess, addPaymentIsError]);

  /*----------------------------------------------------------*/

  /*------------------------TABLE-----------------------------*/

  const columns = ['ID', '??????????', '????????????????', '????????', '??????????????????????'];
  const [studentPayments, setStudentPayments] = useState();

  useEffect(() => {
    studentPaymentsIsSuccess && setStudentPayments(studentPaymentsData);
  }, [studentPaymentsIsSuccess, studentPaymentsData]);

  const tableTh = columns.map((item, index) => <th key={index}>{item}</th>);
  const tableTr =
    studentPayments && studentPayments.length !== 0 ? (
      studentPayments.map((student, index) => (
        <tr key={index} onClick={() => navigate(`/payment?id=${student.id}`)}>
          <td data-label="ID">{student.id}</td>
          <td data-label="??????????">{student.sum.toLocaleString('ru')}</td>
          <td data-label="????????????????">
            {recruitersIsSuccess &&
              recruiters.map((recruiter) =>
                recruiter.id === student.recruiter ? recruiter.username : ''
              )}
          </td>
          <td data-label="????????">{student.date.slice(0, 10)}</td>
          <td data-label="????????????????????????">
            {student.comment ? student.comment : '-'}
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={5}>No available Data</td>
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
            title="???????????????? ????????????"
          >
            <div className="modal__inputs">
              <div className="modal__input-container">
                <label htmlFor="phone">??????????</label>
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
                <label htmlFor="name">????????????????</label>
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
                <label htmlFor="comment">??????????????????????</label>
                <textarea
                  onChange={(event) =>
                    setPaymentReqBody({
                      ...paymentReqBody,
                      comment: event.target.value,
                    })
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
                  text="????????????????"
                  action={addPaymentHandler}
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
      ) : (
        ''
      )}

      {studentIsSuccess && coursesIsSuccess && studentPaymentsIsSuccess ? (
        <>
          <InfoCard>
            <div className="card">
              <div className="card__header">
                <div className="header__title">
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
                      <label htmlFor="name">??????</label>
                      <input
                        onChange={(event) =>
                          setStudentReqBody({
                            ...studentReqBody,
                            full_name: event.target.value,
                          })
                        }
                        type="text"
                        id="name"
                        minLength="1"
                        maxLength="255"
                        value={studentReqBody.full_name}
                      />
                    </div>
                    <div className="modal__input-container">
                      <label htmlFor="month">?????????? ????????????</label>
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
                      <label htmlFor="discount">????????????</label>
                      <div className="discount__wrapper">
                        <input
                          onChange={(event) =>
                            discountType.current.value === '%'
                              ? setStudentReqBody({
                                  ...studentReqBody,
                                  discount: event.target.value,
                                })
                              : setStudentReqBody({
                                  ...studentReqBody,
                                  discount_of_cash: event.target.value,
                                })
                          }
                          type="number"
                          id="discount"
                          value={
                            studentReqBody.discount ||
                            studentReqBody.discount_of_cash
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
                      <input
                        onChange={(event) =>
                          setStudentReqBody({
                            ...studentReqBody,
                            phone: event.target.value,
                          })
                        }
                        type="text"
                        id="phone"
                        maxLength="15"
                        value={studentReqBody.phone}
                      />
                    </div>
                    <div className="modal__input-container">
                      <label htmlFor="course">????????</label>
                      <div className="select__container">
                        <select
                          onChange={(event) =>
                            setStudentReqBody({
                              ...studentReqBody,
                              course: Number(event.target.value),
                            })
                          }
                          className="select__box"
                          value={studentReqBody.course}
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
                      <label htmlFor="name">????????????????</label>
                      <div className="select__container">
                        <select
                          onChange={(event) =>
                            setStudentReqBody({
                              ...studentReqBody,
                              recruiter: event.target.value,
                            })
                          }
                          className="select__box"
                          value={studentReqBody.recruiter}
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
                      <label htmlFor="student__comment">??????????????????????</label>
                      <textarea
                        onChange={(event) =>
                          setStudentReqBody({
                            ...studentReqBody,
                            comment: event.target.value,
                          })
                        }
                        id="student__comment"
                        value={studentReqBody.comment}
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
                        <p>{student.studies ? '????????????' : '???? ????????????'}</p>
                        <p
                          onClick={() =>
                            navigate(`/courses/course?id=${course.id}`)
                          }
                        >
                          ????????????:{' '}
                          <span className="p__link">
                            {course ? course.title : ''}
                          </span>
                        </p>
                        <p>
                          {student.contract
                            ? '?????????????? ????????????????'
                            : '?????? ????????????????'}
                        </p>
                        <p>?????????? ????????????: {student.start_mount}</p>
                      </div>
                    </div>
                    <div className="card__content-item">
                      <div className="item__icon">
                        <MdAttachMoney />
                      </div>
                      <div className="item__text">
                        <p>????????????: {student.full_discount}</p>
                        <p>
                          {`???????????? ??????????: ${student.full_payment.toLocaleString(
                            'ru'
                          )} ${student.currency}`}
                        </p>
                        <p>
                          {`????????????: ${student.payment.toLocaleString('ru')} ${
                            student.currency
                          }`}
                        </p>
                        <p>
                          {`?????????????? ???? ??????. ??????????: ${student.remainder_for_current_mount.toLocaleString(
                            'ru'
                          )} ${student.currency}`}
                        </p>
                        <p>
                          {`?????????????? ??????????: ${student.remainder.toLocaleString(
                            'ru'
                          )} ${student.currency}`}
                        </p>
                      </div>
                    </div>
                    <div className="card__content-item">
                      <div className="item__icon">
                        <MdEngineering />
                      </div>
                      <div className="item__text">
                        <p>
                          ????????????????:{' '}
                          <span
                            className="p__link"
                            onClick={() =>
                              navigate(`/recruiter?id=${recruiter.id}`)
                            }
                          >
                            {recruiter ? recruiter.username : ''}
                          </span>
                        </p>
                        <p>???????? ????????????: 11.11.2022</p>
                        <p>??????????????????????: ?????? ??????????????????????</p>
                      </div>
                    </div>
                    <div className="card__content-item">
                      <div className="item__icon">
                        <MdContacts />
                      </div>
                      <div className="item__text">
                        <p>Email: {student.email ? student.email : '-'}</p>
                        <p>
                          ??????????????:
                          {student.phone ? (
                            <a
                              className="p__link"
                              href={`tel:${student.phone}`}
                            >
                              {student.phone}
                            </a>
                          ) : (
                            '-'
                          )}
                        </p>
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
                    disabled={isStudentEditingAllowed}
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
            {/* <RowsSlicer /> */}
            <Button text="+???????????????? ????????????" action={onClickClose} />
            {/* <Search /> */}
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

export default StudentInfo;
