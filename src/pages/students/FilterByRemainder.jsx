import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { filterStudentsByRemainder } from '../../redux/slices/dataSlice';

const FilterByRemainder = ({ setInitialData }) => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlRemainder = searchParams.get('remainder');
  const [filterByRemainder, setFilterByRemainder] = useState(
    urlRemainder || false
  );

  useEffect(() => {
    if (urlRemainder) {
      dispatch(filterStudentsByRemainder(true));
    }
  }, []);

  useEffect(() => {
    if (filterByRemainder && !urlRemainder) {
      searchParams.delete('page');
      searchParams.set('remainder', filterByRemainder);
      setSearchParams(searchParams);
      dispatch(filterStudentsByRemainder(true));
    } else if (!filterByRemainder && urlRemainder) {
      searchParams.delete('remainder');
      setSearchParams(searchParams);
      setInitialData();
    }
  }, [filterByRemainder]);

  useEffect(() => {
    if (urlRemainder) {
      setFilterByRemainder(true);
      dispatch(filterStudentsByRemainder(true));
    } else if (!urlRemainder) {
      setFilterByRemainder(false);
      setInitialData();
    }
  }, [urlRemainder]);

  return (
    <div id="filter__container">
      <label htmlFor="remainder__check">Задолженность</label>
      <input
        type="checkbox"
        name="remainder"
        id="remainder__check"
        onChange={() => setFilterByRemainder(!filterByRemainder)}
        checked={filterByRemainder}
      />
    </div>
  );
};

export default FilterByRemainder;
