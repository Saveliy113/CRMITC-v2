//REACT
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useErrorHandler from '../../../hooks/useErrorHandler';

//REDUX
import {
  useGetBranchByIdQuery,
  useGetClientsQuery,
  useGetMentorsQuery,
  useGetTrailLessonsQuery,
  useGetUsersQuery,
} from '../../../services/dataApi';
import { changePage, setFetchData } from '../../../redux/slices/dataSlice';

//COMPONENTS
import DirectionsTable from './DirectionsTable';
import TrailLessonsTable from './BranchLessonsTable';
import EmployeesTable from './EmployeesTable';
import InfoCard from '../../../components/InfoCard';
import Loader from '../../../ui/Loader';
import RowsSlicer from '../../../ui/RowsSlicer';
import Pagination from '../../../ui/Pagination';

//ICONS
import { RiBook3Line, RiBuilding4Line, RiComputerLine } from 'react-icons/ri';
import { MdEngineering } from 'react-icons/md';
import { GiTeacher } from 'react-icons/gi';

//CSS
import './BrancheDetails.css';
import MentorsTable from './MentorsTable';

const BrancheDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const branchId = Number(searchParams.get('id'));
  const urlActiveData = searchParams.get('data');

  //-----------------------DATA-------------------------//

  const [activeData, setActiveData] = useState('directions');
  const currentData = useSelector((store) => store.data.currentData);
  const currentPage = useSelector((store) => store.data.page);

  const {
    data: branchData,
    isSuccess: branchIsSuccess,
    error: branchError,
  } = useGetBranchByIdQuery(branchId);

  const {
    data: employees,
    isSuccess: employeesIsSuccess,
    error: employeesError,
  } = useGetUsersQuery();

  const {
    data: trailLessons,
    isSuccess: trailLessonsIsSuccess,
    error: trailLessonsError,
  } = useGetTrailLessonsQuery();

  const {
    data: clients,
    isSuccess: clientsIsSuccess,
    error: clientsError,
  } = useGetClientsQuery();

  const { data: mentors, isSuccess: mentorsIsSuccess, error: mentorsError } = useGetMentorsQuery()

  console.log(mentors)
  //QUERIES ERRORS HANDLING
  useErrorHandler([
    branchError,
    employeesError,
    trailLessonsError,
    clientsError,
    mentorsError
  ]);

  //SETTING DATA TO REDUX
  useEffect(() => {
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

    if (mentorsIsSuccess && activeData === 'mentors') {
      dispatch(setFetchData({ page: 'mentors', data: mentors }));
    }
  }, [activeData, branchIsSuccess, employeesIsSuccess, mentorsIsSuccess]);

  //CHANGING DATA IF URL PARAMETER 'DATA' HAS BEEN CHANGED
  useEffect(() => {
    setActiveData(urlActiveData);
  }, [urlActiveData]);

  const changeData = (newActiveData) => {
    setActiveData(newActiveData);
    navigate(`?id=${branchId}&data=${newActiveData}`);
  };

  //----------------------------------------------------//

  return branchIsSuccess ? (
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
            <button //MENTORS BUTTON
              className={`branch__card-button ${
                activeData === 'mentors' ? 'active' : ''
              }`}
              onClick={() => changeData('mentors')}
            >
              <GiTeacher />
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
          {activeData === 'directions' && (
            <DirectionsTable
              currentPage={currentPage}
              currentData={currentData}
            />
          )}

          {activeData === 'trail_lessons' && (
            <TrailLessonsTable
              currentPage={currentPage}
              currentData={currentData}
              additionalData={clients}
            />
          )}

          {activeData === 'employees' && (
            <EmployeesTable
              currentPage={currentPage}
              currentData={currentData}
            />
          )}

          {activeData === 'mentors' && (
            <MentorsTable
              currentPage={currentPage}
              currentData={currentData}
            />
          )}
        </div>
        <Pagination />
      </>
    </>
  ) : (
    <Loader />
  );
};

export default BrancheDetails;
