//REACT
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import useNotify from '../../../hooks/useNotify';

//REDUX
import {
  useAddPaymentMutation,
  useDeleteStudentMutation,
  useEditStudentMutation,
  useGetCoursesQuery,
  useGetPaymentsByStudentIdQuery,
  useGetStudentByIdQuery,
  useGetUsersQuery,
} from '../../../services/dataApi';

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
import ReactInputMask from 'react-input-mask';
import InfoCard from '../../../components/InfoCard';
import ModalWindow from '../../../components/ModalWindow';
import Loader from '../../../ui/Loader';
import ModalLoader from '../../../ui/ModalLoader';
import Button from '../../../ui/Button';

//CSS
import './StudentInfo.css';
import 'react-toastify/dist/ReactToastify.css';
import formatDate from '../../../utils/formatDate';
import useErrorHandler from '../../../hooks/useErrorHandler';
import StudentInfoTable from './StudentInfoTable';

const StudentInfo = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { notify } = useNotify();
  const [isEditing, setIsEditing] = useState(false);
  const [studentPayments, setStudentPayments] = useState();

  const studentId = Number(searchParams.get('id'));

  /*--------------------------DATA----------------------------*/

  const [recruiter, setRecruiter] = useState('');
  const [course, setCourse] = useState('');

  const {
    data: student,
    isSuccess: studentIsSuccess,
    error: studentError,
  } = useGetStudentByIdQuery(studentId);

  const {
    data: recruiters,
    isSuccess: recruitersIsSuccess,
    error: recruitersError,
  } = useGetUsersQuery();

  const {
    data: courses,
    isSuccess: coursesIsSuccess,
    error: coursesError,
  } = useGetCoursesQuery();

  const {
    data: studentPaymentsData,
    isSuccess: studentPaymentsIsSuccess,
    error: studentPaymentsError,
  } = useGetPaymentsByStudentIdQuery(studentId);

  //QUERIES ERRORS HANDLING
  useErrorHandler([
    studentError,
    recruitersError,
    coursesError,
    studentPaymentsError,
  ]);

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
        whatsapp: student.whatsapp,
        telegram: student.telegram,
        course: student.course,
        studies: student.studies,
        recruiter: student.recruiter,
        contract: student.contract,
        comment: student.comment,
      });
    }
  }, [courses, recruiters, student, studentIsSuccess]);

  useEffect(() => {
    studentPaymentsIsSuccess && setStudentPayments(studentPaymentsData);
  }, [studentPaymentsIsSuccess, studentPaymentsData]);

  /*----------------------------------------------------------*/

  /*------------------STUDENT DELETING, EDITING, PAYMENT ADDING-----------------------*/

  const [studentReqBody, setStudentReqBody] = useState({});

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
  const [paymentReqBody, setPaymentReqBody] = useState({
    student: studentId,
    sum: '',
    comment: '',
  });
  const discountType = useRef();

  const onClickClose = () => {
    setIsOpened(!isOpened);
  };

  const addPaymentHandler = () => {
    addPayment(paymentReqBody).unwrap();
  };

  /*----------------------------------------------------------*/

  /*-----------------ACTIONS AFTER RESPONSE-------------------*/

  useEffect(() => {
    if (deleteCompleted) {
      notify({ message: 'Студент успешно удален!', type: 'success' });
      setTimeout(() => navigate('/students'), 500);
    }
    if (deleteError) {
      notify({ message: error, type: 'error' });
    }
  }, [deleteCompleted, deleteError]);

  useEffect(() => {
    if (editIsSuccess) {
      notify({ message: 'Изменения внесены успешно!', type: 'success' });
      setTimeout(() => setIsEditing(false), 500);
    }
    if (editIsError) {
      notify({ message: editError, type: 'error' });
    }
  }, [editIsSuccess, editIsError]);

  useEffect(() => {
    if (addPaymentSuccess) {
      setPaymentReqBody({ student: studentId, sum: '', recruiter: '' });
      notify({ message: 'Платеж успешно добавлен!', type: 'success' });
    } else if (addPaymentIsError) {
      notify({ message: addPaymentError, type: 'error' });
    }
  }, [addPaymentSuccess, addPaymentIsError]);

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
                  type="number"
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
            <div className="modal__actions">
              {addPayemntLoading ? (
                <ModalLoader isLoading={addPayemntLoading} />
              ) : (
                <Button
                  id="login__btn"
                  text="Добавить"
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
                        minLength="1"
                        maxLength="255"
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
                      <label htmlFor="course">Курс</label>
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
                      <label htmlFor="name">Рекрутер</label>
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
                      <label htmlFor="student__comment">Комментарий</label>
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
                        <p>{student.studies ? 'Учится' : 'Не учится'}</p>
                        <p
                          onClick={() =>
                            navigate(`/courses/course?id=${course.id}`)
                          }
                        >
                          Группа:{' '}
                          <span className="p__link">
                            {course ? course.title : ''}
                          </span>
                        </p>
                        <p>
                          {student.contract
                            ? 'Договор заключен'
                            : 'Нет договора'}
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
                        <p>
                          {`Полная сумма: ${student.full_payment.toLocaleString(
                            'ru'
                          )} ${student.currency}`}
                        </p>
                        <p>
                          {`Оплата: ${student.payment.toLocaleString('ru')} ${
                            student.currency
                          }`}
                        </p>
                        <p>
                          {`Остаток за тек. месяц: ${student.remainder_for_current_mount.toLocaleString(
                            'ru'
                          )} ${student.currency}`}
                        </p>
                        <p>
                          {`Остаток всего: ${student.remainder.toLocaleString(
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
                          Рекрутер:{' '}
                          <span
                            className="p__link"
                            onClick={() =>
                              navigate(`/recruiter?id=${recruiter.id}`)
                            }
                          >
                            {recruiter ? recruiter.username : ''}
                          </span>
                        </p>
                        <p>Дата записи: {formatDate(student.create_at)}</p>
                        <p>
                          Комментарий:{' '}
                          {student.comment
                            ? student.comment
                            : 'нет комментария'}
                        </p>
                      </div>
                    </div>
                    <div className="card__content-item">
                      <div className="item__icon">
                        <MdContacts />
                      </div>
                      <div className="item__text">
                        <p>Email: {student.email ? student.email : '-'}</p>
                        <p>
                          Телефон:
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
                            href={` https://wa.me/${student.whatsapp}`}
                            id="whatsapp__link"
                            target="blank"
                          >
                            <RiWhatsappFill />
                          </a>
                        ) : (
                          ''
                        )}

                        {student.telegram ? (
                          <a
                            href={`https://telegram.me/${
                              student.telegram.includes('@')
                                ? student.telegram.slice(
                                    1,
                                    student.telegram.length
                                  )
                                : student.telegram
                            }`}
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
            <Button text="+Добавить платеж" action={onClickClose} />
            {/* <Search /> */}
          </div>
          <div className="table__box">
            <StudentInfoTable
              studentPayments={studentPayments}
              additionalData={recruiters}
            />
          </div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default StudentInfo;
