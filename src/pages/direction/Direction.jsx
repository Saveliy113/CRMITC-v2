//REACT
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useErrorHandler from '../../hooks/useErrorHandler';
import DirectionTable from './DirectionTable';

//REDUX
import { setFetchData } from '../../redux/slices/dataSlice';
import { useGetCoursesQuery } from '../../services/dataApi';

//COMPONENTS
import Loader from '../../ui/Loader';
import Pagination from '../../ui/Pagination';
import RowsSlicer from '../../ui/RowsSlicer';

const Direction = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const directionId = Number(searchParams.get('id'));
  const directionTitle = searchParams.get('title');
  const currentPage = useSelector((store) => store.data.page);

  //-----------------------DATA-------------------------//

  const {
    data: directionData,
    isSuccess: directionSuccess,
    error: directionError,
  } = useGetCoursesQuery();

  //QUERIES ERRORS HANDLING
  useErrorHandler([directionError]);

  //SETTING DATA TO REDUX
  useEffect(() => {
    if (directionSuccess) {
      dispatch(
        setFetchData({
          page: 'direction',
          data: directionData.filter(
            (course) => course.direction === directionId
          ),
        })
      );
    }
  }, [directionSuccess]);

  const directionCourses = useSelector((store) => store.data.currentData);

  //-----------------------TABLE-------------------------//

  //----------------------------------------------------//

  return (
    <>
      <h1>{directionTitle}</h1>
      <h3>Курсы в этом направлении</h3>
      {directionSuccess ? (
        <>
          <div className="table__actions-box">
            <RowsSlicer />
          </div>
          <div className="table__box">
            <DirectionTable
              currentPage={currentPage}
              directionCourses={directionCourses}
            />
          </div>
          <Pagination />
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Direction;
