//REACT
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

//COMPONENTS
import Pagination from '../ui/Pagination';
import RowsSlicer from '../ui/RowsSlicer';
import Search from '../ui/Search';
import Loader from '../ui/Loader';

//REDUX
import { setFetchData } from '../redux/slices/dataSlice';
import { useGetCountriesQuery } from '../services/dataApi';

//CSS
import '../css/pages/Students.css';
import styles from '../ui/Table.module.css';

const Branches = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const columns = ['ID', 'Страна'];
  const currentPage = useSelector((store) => store.data.page);

  //-----------------------DATA-------------------------//

  const { data: countriesData, isSuccess: countriesIsSuccess } =
    useGetCountriesQuery();

  useEffect(() => {
    countriesIsSuccess &&
      dispatch(setFetchData({ page: 'branches', data: countriesData }));
  }, [countriesIsSuccess]);

  const countries = useSelector((store) => store.data.currentData);

  //----------------------------------------------------//

  //-----------------------TABLE-------------------------//

  const tableTh = columns.map((item, index) => <th key={index}>{item}</th>);
  const tableTr =
    currentPage === 'branches' && countries && countries.length !== 0 ? (
      countries.map((country, index) => (
        <tr
          key={index}
          onClick={() =>
            navigate(`country_details?id=1&country=${country.name}`)
          }
        >
          <td data-label="id">{country.id}</td>
          <td data-label="Страна">{country.name}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={2}>No available data</td>
      </tr>
    );

  return (
    <>
      {countriesIsSuccess ? (
        <>
          <div className="table__actions-box">
            <RowsSlicer />
            <Search placeholder="Страна" />
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

export default Branches;
