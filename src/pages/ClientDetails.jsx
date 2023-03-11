//REACT
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

//REDUX
import {
  useDeleteClientMutation,
  useEditClientMutation,
  useGetClientByIdQuery,
  useGetClientStatusQuery,
  useGetTrailLessonsQuery,
  useGetUsersQuery,
} from '../services/dataApi';

//ICONS
import {
  RiSave3Fill,
  RiDeleteBin2Line,
  RiEdit2Line,
  RiArrowGoBackLine,
  RiWhatsappFill,
} from 'react-icons/ri';

//COMPONENTS
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../ui/Loader';
import ModalLoader from '../ui/ModalLoader';

//CSS
import '../css/pages/ClientDetails.css';

const ClientDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const clientId = Number(searchParams.get('id'));

  //-----------------------DATA-------------------------//

  const { data: trailLessons, isSuccess: trailLessonsIsSuccess } =
    useGetTrailLessonsQuery();
  const { data: client, isSuccess: clientIsSuccess } =
    useGetClientByIdQuery(clientId);
  const { data: clientStatus, isSuccess: clientStatusIsSuccess } =
    useGetClientStatusQuery();
  const { data: recruiters, isSuccess: recruitersIsSuccess } =
    useGetUsersQuery();

  useEffect(() => {
    if (clientIsSuccess && trailLessonsIsSuccess && recruitersIsSuccess) {
      setClientReqBody({
        name: client.name,
        phone: client.phone,
        whatsapp: client.whatsapp,
        comment: client.comment,
        trail_lesson: client.trail_lesson,
        status: client.status,
        recruiter: client.recruiter,
      });
    }
  }, [clientIsSuccess, trailLessonsIsSuccess, recruitersIsSuccess]);

  //----------------------------------------------------//

  /*-----------------COURSE EDITING, DELITING and STUDENT ADDING----------------------*/

  const [clientReqBody, setClientReqBody] = useState({});

  const [
    editClient,
    {
      isLoading: editIsLoading,
      isSuccess: editIsSuccess,
      isError: editIsError,
      error: editError,
    },
  ] = useEditClientMutation();

  const [
    deleteClient,
    {
      isSuccess: deleteCompleted,
      isLoading: deleteLoading,
      isError: deleteError,
      error,
    },
  ] = useDeleteClientMutation();

  let isClientEditingAllowed = clientReqBody.name ? true : false; //THIS INPUT FIELDS MUST BE FILLED

  const editHandler = () => {
    editClient({
      clientId,
      reqBody: clientReqBody,
    }).unwrap();
  };

  const deleteHandler = () => {
    deleteClient(clientId);
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
      notifySuccess('Клиент успешно удален!');
      setTimeout(() => navigate(-1), 2000);
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
      }, 1000);
    }
    if (editIsError) {
      notifyError(editError);
    }
  }, [editIsSuccess, editIsError]);

  /*----------------------------------------------------------*/

  return clientIsSuccess &&
    recruitersIsSuccess &&
    recruitersIsSuccess &&
    trailLessonsIsSuccess ? (
    <div className="paymentDetails__card">
      <ToastContainer />
      <div className="paymentDetails__header">
        <h3>Клиент</h3>
      </div>
      <div className="paymentDetails__content">
        {isEditing ? (
          <div className="card__edit-container">
            <RiArrowGoBackLine
              id="edit__container-back"
              onClick={() => setIsEditing(false)}
            />
            <div className="modal__input-container">
              <label htmlFor="name">Имя</label>
              <input
                onChange={(event) =>
                  setClientReqBody({
                    ...clientReqBody,
                    name: event.target.value,
                  })
                }
                type="text"
                id="name"
                minLength="1"
                maxLength="255"
                value={clientReqBody.name}
              />
            </div>
            <div className="modal__input-container">
              <label htmlFor="phone">Телефон</label>
              <input
                onChange={(event) =>
                  setClientReqBody({
                    ...clientReqBody,
                    phone: event.target.value,
                  })
                }
                type="text"
                id="phone"
                value={clientReqBody.phone}
              />
            </div>
            <div className="modal__input-container">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                onChange={(event) =>
                  setClientReqBody({
                    ...clientReqBody,
                    whatsapp: event.target.value,
                  })
                }
                type="text"
                id="whatsapp"
                value={clientReqBody.whatsapp}
              />
            </div>
            <div className="modal__input-container">
              <label>Статус</label>
              <div className="select__container">
                <select
                  onChange={(event) =>
                    setClientReqBody({
                      ...clientReqBody,
                      status: Number(event.target.value),
                    })
                  }
                  className="select__box"
                  value={clientReqBody.status}
                >
                  <option hidden selected>
                    Выберите статус
                  </option>
                  {clientStatus.map((status, i) => (
                    <option key={i} value={status.id}>
                      {status.title}
                    </option>
                  ))}
                </select>
                <div className="icon__container">
                  <svg
                    height="25"
                    width="25"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    focusable="false"
                    className="css-tj5bde-Svg"
                  >
                    <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className="modal__input-container">
              <label>Рекрутер</label>
              <div className="select__container">
                <select
                  onChange={(event) =>
                    setClientReqBody({
                      ...clientReqBody,
                      recruiter: Number(event.target.value),
                    })
                  }
                  className="select__box"
                  value={clientReqBody.recruiter}
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
                  <svg
                    height="25"
                    width="25"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    focusable="false"
                    className="css-tj5bde-Svg"
                  >
                    <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className="modal__input-container">
              <label htmlFor="client__description">Комментарий</label>
              <textarea
                onChange={(event) =>
                  setClientReqBody({
                    ...clientReqBody,
                    description: event.target.value,
                  })
                }
                id="client__description"
                value={clientReqBody.description}
              />
            </div>
          </div>
        ) : (
          <>
            <h3>ФИО: {client.name}</h3>
            <h3>
              Пробный урок:{' '}
              {
                trailLessons.find((lesson) => lesson.id === client.trail_lesson)
                  .title
              }
            </h3>
            <h3>
              Телефон: <a href={`tel:${client.phone}`}>{client.phone}</a>
            </h3>
            <h3>
              Статус:{' '}
              {clientStatus.find((status) => status.id === client.status).title}
            </h3>
            <h3>
              Рекрутер:{' '}
              {
                recruiters.find(
                  (recruiter) => recruiter.id === client.recruiter
                ).username
              }
            </h3>
            {client.comment ? <h3>Комментарий: {client.comment}</h3> : ''}
            {client.whatsapp ? (
              <a href={client.whatsapp} id="whatsapp__link" target="blank">
                <RiWhatsappFill />
              </a>
            ) : (
              ''
            )}
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
            disabled={!isClientEditingAllowed}
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

export default ClientDetails;
