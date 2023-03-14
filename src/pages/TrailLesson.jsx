//REACT
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

//REDUX
import {
  useGetTrailLessonByIdQuery,
  useGetBranchesQuery,
  useGetClientsQuery,
  useGetDirectionsQuery,
  useGetMentorsQuery,
  useGetUsersQuery,
  useEditTrailLessonMutation,
  useDeleteTrailLessonMutation,
  useAddClientMutation,
  useGetClientStatusQuery,
} from '../services/dataApi';
import { setFetchData } from '../redux/slices/dataSlice';

//ICONS
import {
  RiComputerLine,
  RiArrowGoBackLine,
  RiDeleteBin2Line,
  RiEdit2Line,
  RiSave3Fill,
  RiFileInfoLine,
  RiPhoneFill,
} from 'react-icons/ri';

//COMPONENTS
import { ToastContainer, toast } from 'react-toastify';
import { CSSTransition } from 'react-transition-group';
import ReactInputMask from 'react-input-mask';
import Select from 'react-select';
import Button from '../ui/Button';
import InfoCard from '../components/InfoCard';
import ModalWindow from '../components/ModalWindow';
import Loader from '../ui/Loader';
import ModalLoader from '../ui/ModalLoader';

//CSS
import '../css/pages/TrailLesson.css';
import styles from '../ui/Table.module.css';

const TrailLesson = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const lessonId = Number(searchParams.get('id'));
  const currentPage = useSelector((store) => store.data.page);

  //-----------------------DATA-------------------------//

  const { data: clientsData, isSuccess: clientsIsSuccess } =
    useGetClientsQuery();
  const { data: trailLesson, isSuccess: trailLessonIsSuccess } =
    useGetTrailLessonByIdQuery(lessonId);
  const { data: recruiters, isSuccess: recruitersIsSuccess } =
    useGetUsersQuery();
  const { data: clientStatus, isSuccess: clientStatusIsSuccess } =
    useGetClientStatusQuery();
  const { data: mentors, isSuccess: mentorsIsSuccess } = useGetMentorsQuery();
  const { data: branches, isSuccess: branchesIsSuccess } =
    useGetBranchesQuery();
  const { data: directions, isSuccess: directionsIsSuccess } =
    useGetDirectionsQuery();

  useEffect(() => {
    clientsIsSuccess &&
      dispatch(
        setFetchData({
          page: 'trail_lesson',
          data: clientsData.filter(
            (client) => client.trail_lesson === lessonId
          ),
        })
      );
  }, [clientsIsSuccess, clientsData]);

  useEffect(() => {
    if (
      trailLessonIsSuccess &
      branchesIsSuccess &
      directionsIsSuccess &
      mentorsIsSuccess &
      recruitersIsSuccess
    ) {
      setLessonReqBody({
        title: trailLesson.title,
        date: trailLesson.date.slice(0, 10),
        description: trailLesson.description,
        branch: trailLesson.branch,
        directions: directions
          .filter((direction, i) =>
            trailLesson.directions.includes(direction.id)
          )
          .map((direction) => {
            return {
              value: direction.id,
              label: direction.title,
            };
          }),
        mentors: mentors
          .filter((mentor, i) => trailLesson.mentors.includes(mentor.id))
          .map((mentor) => {
            return {
              value: mentor.id,
              label: mentor.first_name,
            };
          }),
        recruiter: recruiters
          .filter((recruiter) => trailLesson.recruiter.includes(recruiter.id))
          .map((recruiter) => {
            return {
              value: recruiter.id,
              label: recruiter.username,
            };
          }),
      });
    }
  }, [
    trailLesson,
    trailLessonIsSuccess,
    branchesIsSuccess,
    directionsIsSuccess,
    mentorsIsSuccess,
    recruitersIsSuccess,
  ]);

  const clients = useSelector((store) => store.data.currentData);

  //----------------------------------------------------//

  /*-----------------COURSE EDITING, DELITING and STUDENT ADDING----------------------*/

  const [lessonReqBody, setLessonReqBody] = useState({});

  const [
    editLesson,
    {
      isLoading: editIsLoading,
      isSuccess: editIsSuccess,
      isError: editIsError,
      error: editError,
    },
  ] = useEditTrailLessonMutation();

  const [
    deleteLesson,
    {
      isSuccess: deleteCompleted,
      isLoading: deleteLoading,
      isError: deleteError,
      error,
    },
  ] = useDeleteTrailLessonMutation();

  let isLessonEditingAllowed =
    lessonReqBody.title &&
    lessonReqBody.date &&
    lessonReqBody.directions.length !== 0 &&
    lessonReqBody.mentors.length !== 0 &&
    lessonReqBody.recruiter.length !== 0
      ? true
      : false; //THIS INPUT FIELDS MUST BE FILLED

  const editHandler = () => {
    editLesson({
      lessonId,
      reqBody: {
        ...lessonReqBody,
        directions: lessonReqBody.directions.map(
          (direction) => direction.value
        ),
        mentors: lessonReqBody.mentors.map((mentor) => mentor.value),
        recruiter: lessonReqBody.recruiter.map((recruiter) => recruiter.value),
      },
    }).unwrap();
  };

  const deleteHandler = () => {
    deleteLesson(lessonId);
  };

  const optionsList =
    directionsIsSuccess && mentorsIsSuccess && recruitersIsSuccess
      ? {
          directions: directions.map((direction) => {
            return {
              value: direction.id,
              label: direction.title,
            };
          }),
          mentors: mentors.map((mentor) => {
            return {
              value: mentor.id,
              label: mentor.first_name,
            };
          }),
          recruiter: recruiters.map((recruiter) => {
            return {
              value: recruiter.id,
              label: recruiter.username,
            };
          }),
        }
      : {};

  /*----------------------------------------------------------*/

  /*---------------------MODAL WINDOW-------------------------*/

  const [isOpened, setIsOpened] = useState(false);
  const [clientReqBody, setClientReqBody] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    comment: '',
    trail_lesson: lessonId,
    status: '',
    recruiter: '',
  });

  const isClientAddAllowed = clientReqBody.name ? true : false; //THIS INPUT FIELD MUST BE FILLED
  const [
    addClient,
    {
      isSuccess: addClientIsSuccess,
      isLoading: addClientLoading,
      isError: addClientIsError,
      error: addClientError,
    },
  ] = useAddClientMutation();

  const onClickClose = () => {
    setIsOpened(!isOpened);
  };

  const submitHandler = async () => {
    await addClient(clientReqBody).unwrap();
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
      notifySuccess('Пробный урок успешно удален!');
      setTimeout(() => navigate('/trail_lessons'), 1500);
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

  useEffect(() => {
    if (addClientIsSuccess) {
      setClientReqBody({});
      notifySuccess('Клиент успешно добавлен!');
    } else if (addClientIsError) {
      notifyError(addClientError);
    }
  }, [addClientIsSuccess, addClientIsError]);

  /*----------------------------------------------------------*/

  //-----------------------TABLE-------------------------//

  const columns = ['ID', 'Имя', 'Телефон', 'Дата записи'];
  const tableTh = columns.map((item, index) => <th key={index}>{item}</th>);
  const tableTr =
    currentPage === 'trail_lesson' &&
    clientsIsSuccess &&
    clients &&
    clients.length !== 0 ? (
      clients.map((client, index) => (
        <tr key={index} className="clients__table-tr">
          <td data-label="ID">{client.id}</td>

          <td
            className="link"
            data-label="Имя"
            onClick={() => navigate(`/client_details?id=${client.id}`)}
          >
            {client.name}
          </td>
          <td data-label="Телефон">
            <RiPhoneFill id="phone__icon" />
            <a className="link" href={`tel:${client.phone}`}>
              {client.phone}
            </a>
          </td>
          <td data-label="Дата записи">
            {`${new Date(client.create_at).toLocaleDateString()} ${new Date(
              client.create_at
            )
              .toLocaleTimeString()
              .slice(0, -3)}`}
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={5}>No available data</td>
      </tr>
    );

  //----------------------------------------------------//

  return (
    <>
      <ToastContainer />

      {trailLessonIsSuccess && recruitersIsSuccess ? (
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
            title="+Добавить клиента"
          >
            <div className="modal__inputs">
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
                  id="title"
                  minLength="1"
                  maxLength="255"
                  value={clientReqBody.title}
                />
              </div>
              <div className="modal__input-container">
                <label htmlFor="phone">Телефон</label>
                <ReactInputMask
                  id="phone"
                  value={clientReqBody.phone}
                  mask="+9999999999999"
                  maskChar={null}
                  onChange={(event) =>
                    setClientReqBody({
                      ...clientReqBody,
                      phone: event.target.value,
                    })
                  }
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
                <label htmlFor="description">Описание</label>
                <textarea
                  onChange={(event) =>
                    setClientReqBody({
                      ...clientReqBody,
                      description: event.target.value,
                    })
                  }
                  id="description"
                  value={clientReqBody.description}
                />
              </div>
            </div>
            <div className="modal__actions">
              {addClientLoading ? (
                <ModalLoader />
              ) : (
                <Button
                  text="Добавить"
                  action={submitHandler}
                  disabled={!isClientAddAllowed}
                />
              )}
            </div>
          </ModalWindow>
        </CSSTransition>
      ) : (
        ''
      )}

      {branchesIsSuccess &&
      mentorsIsSuccess &&
      directionsIsSuccess &&
      recruitersIsSuccess &&
      trailLessonIsSuccess ? (
        <>
          <InfoCard>
            <div className="card">
              <div className="card__header">
                <div className="header__title">
                  <RiComputerLine />
                  <h1>{trailLesson.title}</h1>
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
                      <label htmlFor="title">Название</label>
                      <input
                        onChange={(event) =>
                          setLessonReqBody({
                            ...lessonReqBody,
                            title: event.target.value,
                          })
                        }
                        type="text"
                        id="title"
                        minLength="1"
                        maxLength="255"
                        value={lessonReqBody.title}
                      />
                    </div>
                    <div className="modal__input-container">
                      <label htmlFor="date">Дата</label>
                      <input
                        onChange={(event) =>
                          setLessonReqBody({
                            ...lessonReqBody,
                            date: event.target.value,
                          })
                        }
                        type="date"
                        id="date"
                        value={lessonReqBody.date}
                      />
                    </div>
                    <div className="modal__input-container">
                      <label>Филиал</label>
                      <div className="select__container">
                        <select
                          onChange={(event) =>
                            setLessonReqBody({
                              ...lessonReqBody,
                              branch: Number(event.target.value),
                            })
                          }
                          className="select__box"
                          value={lessonReqBody.branch}
                        >
                          <option hidden selected>
                            Выберите филиал
                          </option>
                          {branches.map((branche, i) => (
                            <option key={i} value={branche.id}>
                              {branche.address}
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
                      <label>Направления</label>
                      <Select
                        classNamePrefix="multi-select"
                        isSearchable={false}
                        options={optionsList.directions}
                        placeholder="Направления"
                        closeMenuOnSelect={false}
                        value={lessonReqBody.directions}
                        onChange={(data) =>
                          setLessonReqBody({
                            ...lessonReqBody,
                            directions: data,
                          })
                        }
                        isMulti
                      />
                    </div>
                    <div className="modal__input-container">
                      <label>Менторы</label>
                      <Select
                        classNamePrefix="multi-select"
                        isSearchable={false}
                        options={optionsList.mentors}
                        placeholder="Менторы"
                        closeMenuOnSelect={false}
                        value={lessonReqBody.mentors}
                        onChange={(data) =>
                          setLessonReqBody({ ...lessonReqBody, mentors: data })
                        }
                        isMulti
                      />
                    </div>
                    <div className="modal__input-container">
                      <label>Рекрутеры</label>
                      <Select
                        classNamePrefix="multi-select"
                        isSearchable={false}
                        closeMenuOnSelect={false}
                        options={optionsList.recruiter}
                        placeholder="Рекрутеры"
                        value={lessonReqBody.recruiter}
                        onChange={(data) =>
                          setLessonReqBody({
                            ...lessonReqBody,
                            recruiter: data,
                          })
                        }
                        isMulti
                      />
                    </div>
                    <div className="modal__input-container">
                      <label htmlFor="description">Описание</label>
                      <textarea
                        onChange={(event) =>
                          setLessonReqBody({
                            ...lessonReqBody,
                            description: event.target.value,
                          })
                        }
                        id="description"
                        value={lessonReqBody.description}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="card__content-item">
                      <div className="item__icon">
                        <RiFileInfoLine />
                      </div>
                      <div className="item__text">
                        <p>
                          {trailLesson.branch
                            ? `Филиал: ${
                                branches.find(
                                  (branch) => branch.id === trailLesson.branch
                                ).address
                              }`
                            : ''}
                        </p>
                        <p>Количество записавшихся: {clients.length}</p>
                        <p>Дата: {trailLesson.date.slice(0, 10)}</p>
                        <p>
                          Направления:
                          {directions
                            .filter((direction, i) =>
                              trailLesson.directions.includes(direction.id)
                            )
                            .map(
                              (direction, i, arr) =>
                                ` ${direction.title}${
                                  i === arr.length - 1 ? '' : ','
                                }`
                            )}
                        </p>
                        <p>
                          Менторы:
                          {mentors
                            .filter((mentor, i) =>
                              trailLesson.mentors.includes(mentor.id)
                            )
                            .map(
                              (mentor, i, arr) =>
                                ` ${mentor.first_name}${
                                  i === arr.length - 1 ? '' : ','
                                }`
                            )}
                        </p>
                        <p>
                          Рекрутеры:
                          {recruiters
                            .filter((recruiter) =>
                              trailLesson.recruiter.includes(recruiter.id)
                            )
                            .map(
                              (mentor, i, arr) =>
                                ` ${mentor.username}${
                                  i === arr.length - 1 ? '' : ','
                                }`
                            )}
                        </p>
                        <p>
                          {trailLesson.description
                            ? `Описание: ${trailLesson.description}`
                            : ''}
                        </p>
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
                    disabled={!isLessonEditingAllowed}
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
            <Button text="+Добавить клиента" action={onClickClose} />
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

export default TrailLesson;
