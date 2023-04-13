import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { filterStudentsByRemainder } from '../../redux/slices/dataSlice';

const FilterByRemainder = ({
  filterByRemainder = false,
  setFilterByRemainder,
}) => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (filterByRemainder) {
      searchParams.set('remainder', true);
      searchParams.delete('page');
      setSearchParams(searchParams);
    } else {
      searchParams.delete('remainder');
      setSearchParams(searchParams);
      setFilterByRemainder(false);
    }
    dispatch(filterStudentsByRemainder(filterByRemainder));
  }, [filterByRemainder]);

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
