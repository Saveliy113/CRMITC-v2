//REACT
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

//REDUX
import { setFetchData } from '../redux/slices/dataSlice';
import { useGetBranchesQuery } from '../services/dataApi';

//COMPONENTS
import RowsSlicer from '../ui/RowsSlicer';
import Loader from '../ui/Loader';
import Pagination from '../ui/Pagination';

//CSS
import styles from '../ui/Table.module.css';

const CountryDetail = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentPage = useSelector((store) => store.data.page);
  const countryId = Number(searchParams.get('id'));
  const country = searchParams.get('country');

  //-----------------------DATA-------------------------//

  const { data: branchesData, isSuccess: branchesIsSuccess } =
    useGetBranchesQuery();

  useEffect(() => {
    if (branchesIsSuccess) {
      dispatch(
        setFetchData({
          page: 'branches',
          data: branchesData.filter((branche) => branche.country === countryId),
        })
      );
    }
  }, [branchesIsSuccess]);

  const branches = useSelector((store) => store.data.currentData);

  //----------------------------------------------------//

  //-----------------------TABLE-------------------------//

  const columns = ['ID', 'Город', 'Адрес'];
  const tableTh = columns.map((item, index) => <th key={index}>{item}</th>);

  const tableTr =
    currentPage === 'branches' && branches && branches.length !== 0 ? (
      branches.map((branche, index) => {
        return (
          <tr
            key={index}
            onClick={() =>
              navigate(`branche_details?id=${branche.id}&data=directions`)
            }
          >
            <td data-label="ID">{branche.id}</td>
            <td data-label="Город">{branche.city}</td>
            <td data-label="Адрес">{branche.address}</td>
          </tr>
        );
      })
    ) : (
      <tr>
        <td colSpan={3}>No available data</td>
      </tr>
    );

  //----------------------------------------------------//

  return (
    <>
      <h1>{country}</h1>
      {branchesIsSuccess ? (
        <>
          <div className="table__actions-box">
            <RowsSlicer />
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

export default CountryDetail;
