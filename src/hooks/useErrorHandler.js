import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { toggleLoginForm } from '../redux/slices/loginFormSlice';
import useNotify from './useNotify';

const useErrorHandler = (errors = []) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notify } = useNotify();

  const filteredErrors = errors.filter((error) => error);

  if (filteredErrors.length) {
    if (
      filteredErrors.find(
        (error) => error.status === 401 || error.originalStatus === 401
      )
    ) {
      notify({
        message: 'Для работы с системой необходимо авторизоваться.',
        type: 'error',
      });
      navigate('/');
      setTimeout(() => dispatch(toggleLoginForm(true)), 300);
    } else {
      throw new Error('An error has occurred');
    }
  }
};

export default useErrorHandler;
