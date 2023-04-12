//REACT
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useNotify from '../../hooks/useNotify';

//REDUX
import { setFetchData } from '../../redux/slices/dataSlice';
import {
  useAddTrailLessonMutation,
  useGetBranchesQuery,
  useGetClientsQuery,
  useGetDirectionsQuery,
  useGetMentorsQuery,
  useGetTrailLessonsQuery,
  useGetUsersQuery,
} from '../../services/dataApi';

//ICONS

//COMPONENTS
import { CSSTransition } from 'react-transition-group';
import RowsSlicer from '../../ui/RowsSlicer';
import Loader from '../../ui/Loader';
import Pagination from '../../ui/Pagination';
import ModalWindow from '../../components/ModalWindow';
import ModalLoader from '../../ui/ModalLoader';
import Search from '../../ui/Search';
import Button from '../../ui/Button';
import Select from 'react-select';

//CSS
import styles from '../..//ui/Table.module.css';
import 'react-toastify/dist/ReactToastify.css';
import './TrailLessons.css';
import useErrorHandler from '../../hooks/useErrorHandler';
import TrailLessonsTable from './TrailLessonsTable';

const TrailLessons = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notify } = useNotify();
  const currentPage = useSelector((store) => store.data.page);

  //-----------------------DATA-------------------------//

  const {
    data: trailLessonsData,
    isSuccess: trailLessonsIsSuccess,
    error: trailLessonsError,
  } = useGetTrailLessonsQuery();

  const {
    data: recruiters,
    isSuccess: recruitersIsSuccess,
    error: recruitersError,
  } = useGetUsersQuery();

  const {
    data: mentors,
    isSuccess: mentorsIsSuccess,
    error: mentorsError,
  } = useGetMentorsQuery();

  const {
    data: branches,
    isSuccess: branchesIsSuccess,
    error: branchesError,
  } = useGetBranchesQuery();

  const {
    data: directions,
    isSuccess: directionsIsSuccess,
    error: directionsError,
  } = useGetDirectionsQuery();

  const {
    data: clients,
    isSuccess: clientsIsSuccess,
    error: clientsError,
  } = useGetClientsQuery();

  //QUERIES ERRORS HANDLING
  useErrorHandler([
    trailLessonsError,
    recruitersError,
    mentorsError,
    branchesError,
    directionsError,
    clientsError,
  ]);

  //SETTING DATA TO REDUX
  useEffect(() => {
    trailLessonsIsSuccess &&
      dispatch(
        setFetchData({
          page: 'trail_lessons',
          data: trailLessonsData,
        })
      );
  }, [trailLessonsIsSuccess, trailLessonsData]);

  const trailLessons = useSelector((store) => store.data.currentData);

  //----------------------------------------------------//

  //---------------- MODAL WINDOW ------------------//

  const [isOpened, setIsOpened] = useState(false);
  const [reqBody, setReqBody] = useState({
    title: '',
    date: '',
    description: '',
    branch: '',
    directions: [],
    mentors: [],
    recruiter: [],
  });

  const isLessonAddAllowed =
    reqBody.title &&
    reqBody.date &&
    reqBody.directions.length !== 0 &&
    reqBody.mentors.length !== 0 &&
    reqBody.recruiter.length !== 0
      ? true
      : false;

  const [
    addTrailLesson,
    {
      isSuccess: addTrailLessonIsSuccess,
      isLoading: addTrailLessonLoading,
      isError: addTrailLessonIsError,
      error: addTrailLessonError,
    },
  ] = useAddTrailLessonMutation();

  const onClickClose = () => {
    setIsOpened(!isOpened);
  };

  const submitHandler = async () => {
    await addTrailLesson({
      ...reqBody,
      directions: reqBody.directions.map((direction) => direction.value),
      mentors: reqBody.mentors.map((mentor) => mentor.value),
      recruiter: reqBody.recruiter.map((recruiter) => recruiter.value),
    }).unwrap();
  };

  //----------------------------------------------------//

  //----------------ACTIONS AFTER QUERY RESPONSE------------------//

  useEffect(() => {
    if (addTrailLessonIsSuccess) {
      setReqBody({
        title: '',
        date: '',
        description: '',
        branch: '',
        directions: [],
        mentors: [],
        recruiter: [],
      });
      notify({ message: 'Пробный урок успешно добавлен!', type: 'success' });
      setTimeout(() => setIsOpened(false), 500);
    } else if (addTrailLessonIsError) {
      notify({ message: addTrailLessonError, type: 'Error' });
    }
  }, [addTrailLessonIsSuccess, addTrailLessonIsError]);

  //-----------------------------------------------//

  //-----------------------REACT SELECT-------------------------//

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

  return trailLessonsIsSuccess &&
    directionsIsSuccess &&
    mentorsIsSuccess &&
    recruitersIsSuccess ? (
    <>
      {directionsIsSuccess &&
      mentorsIsSuccess &&
      recruitersIsSuccess &&
      branchesIsSuccess ? (
        <CSSTransition //MODAL WINDOW
          in={isOpened}
          timeout={200}
          classNames={'modal'}
          unmountOnExit
        >
          <ModalWindow
            opened={isOpened}
            action={onClickClose}
            submit={submitHandler}
            title="Добавить пробный урок"
          >
            <div className="modal__inputs">
              <div className="modal__input-container">
                <label htmlFor="title">Название</label>
                <input
                  onChange={(event) =>
                    setReqBody({ ...reqBody, title: event.target.value })
                  }
                  type="text"
                  id="title"
                  minLength="1"
                  maxLength="255"
                  value={reqBody.title}
                />
              </div>
              <div className="modal__input-container">
                <label htmlFor="date">Дата</label>
                <input
                  onChange={(event) =>
                    setReqBody({ ...reqBody, date: event.target.value })
                  }
                  type="date"
                  id="date"
                  value={reqBody.date}
                />
              </div>
              <div className="modal__input-container">
                <label>Филиал</label>
                <div className="select__container">
                  <select
                    onChange={(event) =>
                      setReqBody({
                        ...reqBody,
                        branch: Number(event.target.value),
                      })
                    }
                    className="select__box"
                    value={reqBody.branch}
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
                  value={reqBody.directions}
                  onChange={(data) =>
                    setReqBody({ ...reqBody, directions: data })
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
                  value={reqBody.mentors}
                  onChange={(data) => setReqBody({ ...reqBody, mentors: data })}
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
                  value={reqBody.recruiter}
                  onChange={(data) =>
                    setReqBody({ ...reqBody, recruiter: data })
                  }
                  isMulti
                />
              </div>
              <div className="modal__input-container">
                <label htmlFor="description">Описание</label>
                <textarea
                  onChange={(event) =>
                    setReqBody({ ...reqBody, description: event.target.value })
                  }
                  id="description"
                  value={reqBody.description}
                />
              </div>
            </div>
            <div className="modal__actions">
              {addTrailLessonLoading ? (
                <ModalLoader />
              ) : (
                <Button
                  text="Добавить"
                  action={submitHandler}
                  disabled={!isLessonAddAllowed}
                />
              )}
            </div>
          </ModalWindow>
        </CSSTransition>
      ) : (
        ''
      )}

      <>
        <div className="table__actions-box">
          <RowsSlicer />
          <Button text="+Добавить урок" action={onClickClose} />
          <Search placeholder="Название урока" />
        </div>
        <div className="table__box">
          <TrailLessonsTable
            currentPage={currentPage}
            trailLessons={trailLessons}
            additionalData={{ branches, clients }}
          />
        </div>
        <Pagination />
      </>
    </>
  ) : (
    <Loader />
  );
};

export default TrailLessons;
