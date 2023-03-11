//REACT
import React, { useState, useEffect } from 'react';
import {
  useNavigate,
  useSearchParams,
  Routes,
  Route,
  Navigate,
  useParams,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

//REDUX
import {
  useGetBranchByIdQuery,
  useGetClientsQuery,
  useGetTrailLessonsQuery,
  useGetUsersQuery,
} from '../services/dataApi';
import { changePage, setFetchData } from '../redux/slices/dataSlice';

//COMPONENTS
import InfoCard from '../components/InfoCard';
import Loader from '../ui/Loader';
import RowsSlicer from '../ui/RowsSlicer';
import Pagination from '../ui/Pagination';

//ICONS
import { RiBook3Line, RiBuilding4Line, RiComputerLine } from 'react-icons/ri';
import { MdEngineering } from 'react-icons/md';

//CSS
import '../css/pages/BrancheDetails.css';
import styles from '../ui/Table.module.css';

const BrancheDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const branchId = Number(searchParams.get('id'));

  //-----------------------DATA-------------------------//

  const [activeData, setActiveData] = useState('directions');
  const urlActiveData = searchParams.get('data');
  const currentData = useSelector((store) => store.data.currentData);
  const currentPage = useSelector((store) => store.data.page);

  const { data: branchData, isSuccess: branchIsSuccess } =
    useGetBranchByIdQuery(branchId);

  const { data: employees, isSuccess: employeesIsSuccess } = useGetUsersQuery();

  const { data: trailLessons, isSuccess: trailLessonsIsSuccess } =
    useGetTrailLessonsQuery();

  const { data: clients, isSuccess: clientsIsSuccess } = useGetClientsQuery();

  useEffect(() => {
    //SETTING DATA TO REDUX
    if (branchIsSuccess && activeData === 'directions') {
      dispatch(
        setFetchData({ page: 'directions', data: branchData.list_direction })
      );
    }

    if (trailLessonsIsSuccess && activeData === 'trail_lessons') {
      dispatch(
        setFetchData({
          page: 'trail_lessons',
          data: trailLessons.filter((lesson) => lesson.branch === branchId),
        })
      );
    }

    if (employeesIsSuccess && activeData === 'employees') {
      dispatch(setFetchData({ page: 'employees', data: employees }));
    }
  }, [activeData, branchIsSuccess, employeesIsSuccess]);

  useEffect(() => {
    //CHANGING DATA IF URL PARAMETER 'DATA' HAS BEEN CHANGED
    setActiveData(urlActiveData);
  }, [urlActiveData]);

  //----------------------------------------------------//

  //-----------------------TABLE-------------------------//

  const directionsColumns = ['ID', 'Направление'];
  const directionsTableTh = directionsColumns.map((item, index) => (
    <th key={index}>{item}</th>
  ));
  const directionsTableTr =
    currentPage === 'directions' &&
    branchIsSuccess &&
    currentData &&
    currentData.length !== 0 ? (
      currentData.map((direction, index) => (
        <tr
          key={index}
          onClick={() =>
            navigate(`/direction?id=${direction.id}&title=${direction.title}`)
          }
        >
          <td data-label="ID">{direction.id}</td>
          <td data-label="Направление">{direction.title}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={2}>No available data</td>
      </tr>
    );

  const trailLessonsColumns = [
    'ID',
    'Заголовок',
    'Дата',
    'Количество участников',
  ];
  const trailLessonsTableTh = trailLessonsColumns.map((item, index) => (
    <th key={index}>{item}</th>
  ));
  const trailLessonsTableTr =
    currentPage === 'trail_lessons' &&
    trailLessonsIsSuccess &&
    clientsIsSuccess &&
    branchIsSuccess &&
    currentData &&
    currentData.length !== 0 ? (
      currentData.map((lesson, index) => (
        <tr
          key={index}
          onClick={() =>
            navigate(`/trail_lessons/trail_lesson?id=${lesson.id}`)
          }
        >
          <td data-label="ID">{lesson.id}</td>
          <td data-label="Заголовок">{lesson.title}</td>
          <td data-label="Дата">
            {new Date(lesson.date).toLocaleString().slice(0, -3)}
          </td>
          <td data-label="Количество участников">
            {
              clients.filter((client) => client.trail_lesson === lesson.id)
                .length
            }
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={4}>No available data</td>
      </tr>
    );

  const employeesColumns = ['ID', 'Имя'];
  const employeesTableTh = employeesColumns.map((item, index) => (
    <th key={index}>{item}</th>
  ));
  const employeesTableTr =
    currentPage === 'employees' &&
    employeesIsSuccess &&
    currentData &&
    currentData.length !== 0 ? (
      currentData.map((employee, index) => (
        <tr
          key={index}
          onClick={() =>
            navigate(`/recruiter?id=${employee.id}&name=${employee.username}`)
          }
        >
          <td data-label="ID">{employee.id}</td>
          <td data-label="Имя">{employee.username}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={2}>No available data</td>
      </tr>
    );

  const changeData = (newActiveData) => {
    setActiveData(newActiveData);
    navigate(`?id=${branchId}&data=${newActiveData}`);
  };
  //----------------------------------------------------//

  return branchData ? (
    <>
      <InfoCard>
        <div className="branch card">
          <div className="branch__card-header">
            <div className="header__title">
              <RiBuilding4Line />
              <h3>{branchData.address}</h3>
            </div>
          </div>
          <div className="card__content">
            <button //DIRECTIONS BUTTON
              className={`branch__card-button ${
                activeData === 'directions' ? 'active' : ''
              }`}
              onClick={() => changeData('directions')}
            >
              <RiBook3Line />
              Направления
            </button>
            <button //TRAI LESSONS BUTTON
              className={`branch__card-button ${
                activeData === 'trail_lessons' ? 'active' : ''
              }`}
              onClick={() => changeData('trail_lessons')}
            >
              <RiComputerLine />
              Пробные уроки
            </button>
            <button //EMPLOYEES BUTTON
              className={`branch__card-button ${
                activeData === 'employees' ? 'active' : ''
              }`}
              onClick={() => changeData('employees')}
            >
              <MdEngineering />
              Сотрудники
            </button>
          </div>
        </div>
      </InfoCard>

      <>
        <div className="table__actions-box">
          <RowsSlicer />
        </div>
        <div className="table__box">
          <table className={styles.table}>
            <thead>
              <tr>
                {activeData === 'directions'
                  ? directionsTableTh
                  : activeData === 'employees'
                  ? employeesTableTh
                  : activeData === 'trail_lessons'
                  ? trailLessonsTableTh
                  : ''}
              </tr>
            </thead>
            <tbody>
              {activeData === 'directions'
                ? directionsTableTr
                : activeData === 'employees'
                ? employeesTableTr
                : activeData === 'trail_lessons'
                ? trailLessonsTableTr
                : ''}
            </tbody>
          </table>
        </div>
        <Pagination />
      </>
    </>
  ) : (
    <Loader />
  );
};

export default BrancheDetails;
