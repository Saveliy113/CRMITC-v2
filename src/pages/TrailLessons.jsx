//REACT
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//REDUX
import { setFetchData } from "../redux/slices/dataSlice";
import {
  useAddTrailLessonMutation,
  useGetBranchesQuery,
  useGetClientsQuery,
  useGetDirectionsQuery,
  useGetMentorsQuery,
  useGetTrailLessonsQuery,
  useGetUsersQuery,
} from "../services/dataApi";

//ICONS

//COMPONENTS
import { CSSTransition } from "react-transition-group";
import { ToastContainer, toast } from "react-toastify";
import RowsSlicer from "../ui/RowsSlicer";
import Loader from "../ui/Loader";
import Pagination from "../ui/Pagination";
import ModalWindow from "../components/ModalWindow";
import ModalLoader from "../ui/ModalLoader";
import Search from "../ui/Search";
import Button from "../ui/Button";
import Select from "react-select";

//CSS
import styles from "../ui/Table.module.css";
import "react-toastify/dist/ReactToastify.css";
import "../css/pages/TrailLessons.css";

const TrailLessons = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentPage = useSelector((store) => store.data.page);

  //-----------------------DATA-------------------------//

  const { data: trailLessonsData, isSuccess: trailLessonsIsSuccess } =
    useGetTrailLessonsQuery();
  const { data: recruiters, isSuccess: recruitersIsSuccess } =
    useGetUsersQuery();
  const { data: mentors, isSuccess: mentorsIsSuccess } = useGetMentorsQuery();
  const { data: branches, isSuccess: branchesIsSuccess } =
    useGetBranchesQuery();
  const { data: directions, isSuccess: directionsIsSuccess } =
    useGetDirectionsQuery();
  const { data: clients, isSuccess: clientsIsSuccess } = useGetClientsQuery();

  useEffect(() => {
    trailLessonsIsSuccess &&
      dispatch(
        setFetchData({
          page: "trail_lessons",
          data: trailLessonsData,
        })
      );
  }, [trailLessonsIsSuccess, trailLessonsData]);

  const trailLessons = useSelector((store) => store.data.currentData);

  //----------------------------------------------------//

  //---------------- MODAL WINDOW ------------------//

  const [isOpened, setIsOpened] = useState(false);
  const [reqBody, setReqBody] = useState({
    title: "",
    date: "",
    description: "",
    branch: "",
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

  const notifySuccess = (text) =>
    toast.success(text, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
    });

  const notifyError = (error) =>
    toast.error(`Ошибка. ${error.data.detail}`, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
    });

  useEffect(() => {
    if (addTrailLessonIsSuccess) {
      setReqBody({
        title: "",
        date: "",
        description: "",
        branch: "",
        directions: [],
        mentors: [],
        recruiter: [],
      });
      notifySuccess("Пробный урок успешно добавлен!");
      setTimeout(() => setIsOpened(false), 1500);
    } else if (addTrailLessonIsError) {
      notifyError(addTrailLessonError);
    }
  }, [addTrailLessonIsSuccess, addTrailLessonIsError]);

  //-----------------------------------------------//

  //-----------------------TABLE-------------------------//
  console.log(trailLessons);
  console.log(branches);
  const columns = [
    "ID",
    "Заголовок",
    "Дата",
    "Филиал",
    "Количество участников",
  ];

  //FINDING BRANCH FOR TABLE DATA
  const findBranch = (id) => {
    const branch = branches.find((branch) => branch.id == id);
    if (branch) {
      return branch.address;
    } else {
      return "-";
    }
  };

  const tableTh = columns.map((item, index) => <th key={index}>{item}</th>);
  const tableTr =
    currentPage === "trail_lessons" &&
    trailLessonsIsSuccess &&
    branchesIsSuccess &&
    trailLessons &&
    trailLessons.length !== 0 ? (
      trailLessons.map((lesson, index) => (
        <tr
          key={index}
          onClick={() => navigate(`trail_lesson?id=${lesson.id}`)}
        >
          <td data-label="ID">{lesson.id}</td>
          <td data-label="Заголовок">{lesson.title}</td>
          <td data-label="Дата">
            {new Date(lesson.date).toLocaleString().slice(0, -3)}
          </td>
          <td data-label="Филиал">{findBranch(lesson.branch)}</td>
          <td data-label="Количество участников">
            {clientsIsSuccess
              ? clients.filter((client) => client.trail_lesson === lesson.id)
                  .length
              : "-"}
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={5}>No available data</td>
      </tr>
    );

  //----------------------------------------------------//

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
      <ToastContainer />

      {directionsIsSuccess &&
      mentorsIsSuccess &&
      recruitersIsSuccess &&
      branchesIsSuccess ? (
        <CSSTransition //MODAL WINDOW
          in={isOpened}
          timeout={200}
          classNames={"modal"}
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
        ""
      )}

      <>
        <div className="table__actions-box">
          <RowsSlicer />
          <Button text="+Добавить урок" action={onClickClose} />
          <Search placeholder="Название урока" />
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
    </>
  ) : (
    <Loader />
  );
};

export default TrailLessons;
