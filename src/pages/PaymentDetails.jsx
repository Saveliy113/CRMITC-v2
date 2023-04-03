//REACT
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

//REDUX
import {
  useDeletePaymentMutation,
  useEditPaymentMutation,
  useGetPaymentByIdQuery,
  useGetStudentsQuery,
  useGetUsersQuery,
} from '../services/dataApi';

//ICONS
import {
  RiSave3Fill,
  RiDeleteBin2Line,
  RiEdit2Line,
  RiArrowGoBackLine,
  RiArrowDownSFill,
} from 'react-icons/ri';

//COMPONENTS
import { ToastContainer, toast } from 'react-toastify';
import CreditCards from '../assets/img/credit_cards.png';
import ModalLoader from '../ui/ModalLoader';
import Loader from '../ui/Loader';

//CSS
import '../css/pages/PaymentDetails.css';

const PaymentDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [recruiter, setRecruiter] = useState('');

  /*--------------------------DATA----------------------------*/

  const paymentId = searchParams.get('id');

  const { data: payment, isSuccess: paymentIsSuccess } =
    useGetPaymentByIdQuery(paymentId);
  const { data: recruiters, isSuccess: recruiterIsSuccess } =
    useGetUsersQuery();
  const { data: students, isSuccess: studentsIsSuccess } =
    useGetStudentsQuery();

  useEffect(() => {
    if (payment) {
      setPaymentReqBody({
        student: payment.student,
        sum: payment.sum,
        recruiter: payment.recruiter,
        date: payment.date,
      });
    }
    if (payment && recruiterIsSuccess) {
      setRecruiter(
        recruiters.find((recruiter) => recruiter.id === payment.recruiter)
      );
    }
  }, [payment, recruiters, students]);

  /*----------------------------------------------------------*/

  /*------------------PAYMENT EDITING, DELITING-----------------------*/

  const [paymentReqBody, setPaymentReqBody] = useState({});

  const [
    editPayment,
    {
      isLoading: editIsLoading,
      isSuccess: editIsSuccess,
      isError: editIsError,
      error: editError,
    },
  ] = useEditPaymentMutation();

  const [
    deletePayment,
    {
      isSuccess: deleteCompleted,
      isLoading: deleteLoading,
      isError: deleteIsError,
      error: deleteError,
    },
  ] = useDeletePaymentMutation();

  const editHandler = () => {
    editPayment({ paymentId, paymentReqBody }).unwrap();
  };

  const deleteHandler = () => {
    deletePayment(paymentId);
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
    if (deleteCompleted) {
      notifySuccess('Изменения внесены успешно!');
      setTimeout(() => setIsEditing(false), 500);
    }
    if (deleteError) {
      notifyError(deleteError);
    }
  }, [deleteCompleted, deleteIsError]);

  useEffect(() => {
    if (editIsSuccess) {
      notifySuccess('Изменения внесены успешно!');
      setTimeout(() => setIsEditing(false), 500);
    }
    if (editIsError) {
      notifyError(editError);
    }
  }, [editIsSuccess, editIsError]);

  const isSavingAllowed = //THIS INPUT FIELDS MUST BE FILLED
    paymentReqBody.student && paymentReqBody.sum && paymentReqBody.recruiter
      ? true
      : false;

  /*----------------------------------------------------------*/

  return payment && recruiter && students ? (
    <div className="paymentDetails__card">
      <ToastContainer />
      <div className="paymentDetails__header">
        <img src={CreditCards} alt="" />
      </div>
      <div className="paymentDetails__content">
        {isEditing ? (
          <div className="card__edit-container">
            <RiArrowGoBackLine
              id="edit__container-back"
              onClick={() => setIsEditing(false)}
            />
            <div className="modal__input-container">
              <label htmlFor="discount">Сумма</label>
              <input
                onChange={(event) =>
                  setPaymentReqBody({
                    ...paymentReqBody,
                    sum: event.target.value,
                  })
                }
                type="number"
                id="discount"
                maxLength="3"
                min={0}
                max={100}
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
        ) : (
          <>
            <h3>
              Студент:{' '}
              {studentsIsSuccess &&
                students.map((student) =>
                  student.id === payment.student ? student.full_name : ''
                )}
            </h3>
            <h3>Сумма: {payment.sum.toLocaleString('ru')}</h3>
            <h3>Рекрутер: {recruiter.username}</h3>
            <h3>Дата: {payment.date.slice(0, 10)}</h3>
            <h3>
              Комментарий:{' '}
              {payment.comment ? payment.comment : 'нет комментария'}
            </h3>
          </>
        )}
      </div>
      <div className="paymentDetails__footer">
        {deleteLoading || editIsLoading ? (
          <ModalLoader />
        ) : isEditing ? (
          <button
            onClick={editHandler}
            id="edit__container-saveBtn"
            disabled={!isSavingAllowed}
          >
            <RiSave3Fill />
          </button>
        ) : (
          <>
            <RiDeleteBin2Line onClick={() => deleteHandler()} />
            <RiEdit2Line
              onClick={() => {
                setIsEditing(!isEditing);
                window.scrollTo({ left: 0, top: 280, behavior: 'smooth' });
              }}
            />
          </>
        )}
      </div>
    </div>
  ) : (
    <Loader />
  );
};

export default PaymentDetails;
