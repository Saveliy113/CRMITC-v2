//REACT
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useNotify from '../../hooks/useNotify';

//REDUX
import {
  useAddPaymentMutation,
  useGetStudentsPaymentsQuery,
  useGetStudentsQuery,
  useGetUsersQuery,
} from '../../services/dataApi';
import { setFetchData } from '../../redux/slices/dataSlice';

//ICONS
import { RiArrowDownSFill } from 'react-icons/ri';

//COMPONENTS
import { CSSTransition } from 'react-transition-group';
import Pagination from '../../ui/Pagination';
import RowsSlicer from '../../ui/RowsSlicer';
import Search from '../../ui/Search';
import Button from '../../ui/Button';
import ModalWindow from '../../components/ModalWindow';
import Loader from '../../ui/Loader';
import ModalLoader from '../../ui/ModalLoader';

//CSS
import '../students/Students.css';
import 'react-toastify/dist/ReactToastify.css';
import PaymentsTable from './PaymentsTable';
import useErrorHandler from '../../hooks/useErrorHandler';

const Payments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notify } = useNotify();
  const currentPage = useSelector((store) => store.data.page);

  //-----------------------DATA-------------------------//

  const {
    data,
    isSuccess: paymentsIsSuccess,
    error: paymentsError,
  } = useGetStudentsPaymentsQuery();
  const {
    data: recruiters,
    isSuccess: recruiterIsSuccess,
    error: recruitersError,
  } = useGetUsersQuery();
  const {
    data: students,
    isSuccess: studentsIsSuccess,
    error: studentsError,
  } = useGetStudentsQuery();

  useEffect(() => {
    paymentsIsSuccess && dispatch(setFetchData({ page: 'payments', data }));
  }, [paymentsIsSuccess]);

  useErrorHandler([paymentsError, recruitersError, studentsError]);

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

  useEffect(() => {
    if (addPaymentSuccess) {
      setReqBody({ student: 0, sum: '', recruiter: 0 });
      notify({ message: 'Платеж успешно добавлен!', type: 'success' });
    } else if (addPaymentIsError) {
      notify({ message: addPaymentError, type: 'error' });
    }
  }, [addPaymentSuccess, addPaymentIsError]);

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
            <PaymentsTable
              currentPage={currentPage}
              payments={payments}
              additionalData={{ students, recruiters }}
            />
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
