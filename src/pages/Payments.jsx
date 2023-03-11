//REACT
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

//REDUX
import {
  useAddPaymentMutation,
  useGetStudentsPaymentsQuery,
  useGetStudentsQuery,
  useGetUsersQuery,
} from '../services/dataApi';
import { setFetchData } from '../redux/slices/dataSlice';

//ICONS
import { RiArrowDownSFill } from 'react-icons/ri';

//COMPONENTS
import { CSSTransition } from 'react-transition-group';
import { ToastContainer, toast } from 'react-toastify';
import Pagination from '../ui/Pagination';
import RowsSlicer from '../ui/RowsSlicer';
import Search from '../ui/Search';
import Button from '../ui/Button';
import ModalWindow from '../components/ModalWindow';
import Loader from '../ui/Loader';
import ModalLoader from '../ui/ModalLoader';

//CSS
import '../css/pages/Students.css';
import styles from '../ui/Table.module.css';
import 'react-toastify/dist/ReactToastify.css';

const Payments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentPage = useSelector((store) => store.data.page);

  //-----------------------DATA-------------------------//

  const { data, isSuccess: paymentsIsSuccess } = useGetStudentsPaymentsQuery();
  const { data: recruiters, isSuccess: recruiterIsSuccess } =
    useGetUsersQuery();
  const { data: students, isSuccess: studentsIsSuccess } =
    useGetStudentsQuery();

  useEffect(() => {
    paymentsIsSuccess && dispatch(setFetchData({ page: 'payments', data }));
  }, [paymentsIsSuccess]);

  const payments = useSelector((store) => store.data.currentData);

  //----------------------------------------------------//

  /*---------------------MODAL WINDOW---------------------*/

  const [isOpened, setIsopened] = useState(false);
  const [reqBody, setReqBody] = useState({ student: 0, sum: '', recruiter: 0 });

  const [
    addPayment,
    {
      isSuccess: addPaymentSuccess,
      isLoading: addPaymentLoading,
      isError: addPaymentIsError,
      error: addPaymentError,
    },
  ] = useAddPaymentMutation();

  const isPaymentAddAllowed =
    reqBody.student && reqBody.sum && reqBody.recruiter ? false : true; //THIS INPUT FIELDS MUST BE FILLED

  const onClickClose = () => {
    setIsopened(!isOpened);
  };

  const submitHandler = () => {
    addPayment(reqBody).unwrap();
  };

  /*------------------------------------------------------*/

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
    toast.error(`Ошибка. ${error.data.detail}`, {
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
    if (addPaymentSuccess) {
      setReqBody({ student: 0, sum: '', recruiter: 0 });
      notifySuccess('Платеж успешно добавлен!');
    } else if (addPaymentIsError) {
      notifyError(addPaymentError);
    }
  }, [addPaymentSuccess, addPaymentIsError]);

  /*------------------------------------------------------*/

  //-----------------------TABLE-------------------------//

  const columns = ['ID', 'Имя', 'Сумма', 'Рекрутер', 'Дата', 'Комментарий'];

  const tableTh = columns.map((item, index) => <th key={index}>{item}</th>);
  const tableTr =
    currentPage === 'payments' && payments && payments.length !== 0 ? (
      payments.map((payment, index) => (
        <tr key={index} onClick={() => navigate(`payment?id=${payment.id}`)}>
          <td data-label="ID">{payment.id}</td>
          <td data-label="Имя">
            {studentsIsSuccess
              ? students.map((student) =>
                  student.id === payment.student ? student.full_name : ''
                )
              : ''}
          </td>
          <td data-label="Сумма">{payment.sum.toLocaleString('ru')}</td>
          <td data-label="Рекрутер">
            {recruiterIsSuccess
              ? recruiters.map((recruiter) =>
                  recruiter.id === payment.recruiter ? recruiter.username : ''
                )
              : ''}
          </td>
          <td data-label="Дата">{payment.date.slice(0, 10)}</td>
          <td data-label="Комментарий">
            {payment.comment ? payment.comment : '-'}
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={6}>No available data</td>
      </tr>
    );

  /*------------------------------------------------------*/

  return (
    <>
      {studentsIsSuccess && recruiterIsSuccess ? (
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
                <label htmlFor="course">Студент</label>
                <div className="select__container">
                  <select
                    onChange={(event) =>
                      setReqBody({ ...reqBody, student: event.target.value })
                    }
                    className="select__box"
                    value={reqBody.student}
                  >
                    <option hidden selected>
                      Выберите студента
                    </option>
                    {students.map((student, i) => (
                      <option key={i} value={student.id}>
                        {student.full_name}
                      </option>
                    ))}
                  </select>
                  <div className="icon__container">
                    <RiArrowDownSFill />
                  </div>
                </div>
              </div>

              <div className="modal__input-container">
                <label htmlFor="phone">Сумма</label>
                <input
                  onChange={(event) =>
                    setReqBody({ ...reqBody, sum: event.target.value })
                  }
                  type="text"
                  id="phone"
                  maxLength="15"
                  value={reqBody.sum}
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
              {addPaymentLoading ? (
                <ModalLoader />
              ) : (
                <Button
                  id="login__btn"
                  text="Добавить"
                  action={submitHandler}
                  disabled={isPaymentAddAllowed}
                />
              )}
            </div>
          </ModalWindow>
        </CSSTransition>
      ) : (
        ''
      )}

      {paymentsIsSuccess ? ( //TABLE
        <>
          <div className="table__actions-box">
            <RowsSlicer />
            <Button text="+Добавить платеж" action={onClickClose} />
            <Search placeholder="Имя студента" searchData={students} />
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

export default Payments;
