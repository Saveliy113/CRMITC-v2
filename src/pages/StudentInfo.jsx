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
import ReactInputMask from 'react-input-mask';
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

  /*----------------------------------------------------------*/

  /*------------------STUDENT DELITING, EDITING, PAYMENT ADDING-----------------------*/

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
      notifySuccess('Студент успешно удален!');
      setTimeout(() => navigate('/students'), 500);
    }
    if (deleteError) {
      notifyError(error);
    }
  }, [deleteCompleted, deleteError]);

  useEffect(() => {
    if (editIsSuccess) {
      notifySuccess('Изменения внесены успешно!');
      setTimeout(() => setIsEditing(false), 500);
    }
    if (editIsError) {
      notifyError(editError);
    }
  }, [editIsSuccess, editIsError]);

  useEffect(() => {
    if (addPaymentSuccess) {
      setPaymentReqBody({ student: studentId, sum: '', recruiter: '' });
      notifySuccess('Платеж успешно добавлен!');
    } else if (addPaymentIsError) {
      notifyError(addPaymentError);
    }
  }, [addPaymentSuccess, addPaymentIsError]);

  /*----------------------------------------------------------*/

  /*------------------------TABLE-----------------------------*/

  const columns = ['ID', 'Сумма', 'Рекрутер', 'Дата', 'Комментарий'];
  const [studentPayments, setStudentPayments] = useState();

  useEffect(() => {
    studentPaymentsIsSuccess && setStudentPayments(studentPaymentsData);
  }, [studentPaymentsIsSuccess, studentPaymentsData]);

  const tableTh = columns.map((item, index) => <th key={index}>{item}</th>);
  const tableTr =
    studentPayments && studentPayments.length !== 0 ? (
      studentPayments.map((student, index) => (
        <tr
          key={index}
          onClick={() => navigate(`/payments/payment?id=${student.id}`)}
        >
          <td data-label="ID">{student.id}</td>
          <td data-label="Сумма">{student.sum.toLocaleString('ru')}</td>
          <td data-label="Рекрутер">
            {recruitersIsSuccess &&
              recruiters.map((recruiter) =>
                recruiter.id === student.recruiter ? recruiter.username : ''
              )}
          </td>
          <td data-label="Дата">{student.date.slice(0, 10)}</td>
          <td data-label="Комменатарий">
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
            <ToastContainer />
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
            <Button text="+Добавить платеж" action={onClickClose} />
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
