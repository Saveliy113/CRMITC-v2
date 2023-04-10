import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { toggleLoginForm } from '../redux/slices/loginFormSlice';
import useNotify from './useNotify';

const useErrorHandler = (error) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notify } = useNotify();

  if (error) {
    if (error.status === 401) {
      notify({
        message: 'Для работы с системой необходимо авторизоваться.',
        type: 'error',
      });
      navigate('/');
      setTimeout(() => dispatch(toggleLoginForm(true)), 300);
    } else {
      throw new Error('Error!!!');
    }
  }
};

export default useErrorHandler;
