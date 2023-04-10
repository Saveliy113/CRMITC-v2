//REACT
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

//REDUX
import { useLogInMutation } from '../services/authApi';
import {
  toggleLoginForm,
  setToken,
  setUsername,
} from '../redux/slices/loginFormSlice';

//ICONS
import {
  RiCloseCircleLine,
  RiCheckboxCircleLine,
  RiErrorWarningLine,
} from 'react-icons/ri';

//COMPONENTS
import { CSSTransition } from 'react-transition-group';
import Button from '../ui/Button';
import ModalLoader from '../ui/ModalLoader';

//CSS
import '../css/components/LoginForm.css';

const LoginForm = () => {
  const dispatch = useDispatch();
  const isOpened = useSelector((state) => state.login.isOpened);
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const onClickClose = (state) => {
    dispatch(toggleLoginForm(state));
  };

  //   -------------------- LOGIN FORM AUTHORIZATION ------------------------ //

  const [
    logIn,
    {
      data,
      error: loginError,
      isError: loginIsError,
      isLoading: logInLoading,
      isSuccess: loginIsSuccess,
    },
  ] = useLogInMutation();

  const authorization = async () => {
    await logIn({
      password,
      username,
    }).unwrap();
  };

  //-----------------------SAVING TOKEN TO REDUX-------------------------//

  const setUserData = () => {
    dispatch(setToken(data.auth_token));
    dispatch(setUsername(username));
  };

  //----------------------------------------------------------------------//

  //-----------------------ACTIONS AFTER RESPONSE-------------------------//

  const [notifyVisibility, setNotifyVisibility] = useState(false);

  useEffect(() => {
    if (loginIsSuccess) {
      setNotifyVisibility(true);
      setUserData();
      setTimeout(() => {
        setNotifyVisibility(false);
        if (isOpened) {
          onClickClose(false);
        }
      }, 500);
    }
    if (loginIsError) {
      setNotifyVisibility(true);
      setTimeout(() => setNotifyVisibility(false), 5000);
    }
  }, [loginIsSuccess, loginIsError]);

  const errorMessages = loginIsError
    ? loginError.status === 400
      ? 'Введен неверный логин или пароль'
      : `Ошибка ${loginError.originalStatus}`
    : '';

  return (
    <CSSTransition in={isOpened} timeout={500} classNames="modal" unmountOnExit>
      <div className={'loginform__container'}>
        <div className={'login__form'} id="login">
          <div id="loginform__close">
            <RiCloseCircleLine onClick={() => onClickClose(false)} />
          </div>
          <h1>Login</h1>
          <div className="loginform__inputs">
            <div className="login__username">
              <input
                onChange={(event) => setUserName(event.target.value)}
                type="text"
                id="username"
                placeholder="Логин"
                maxLength="15"
                value={username}
              />
              <i className="bx bx-user"></i>
            </div>
            <div className="login__password">
              <input
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                id="password"
                placeholder="Пароль"
                maxLength="15"
                value={password}
              />
              <i className="bx bx-lock-open-alt"></i>
            </div>
          </div>

          {loginIsError && notifyVisibility ? (
            <p
              className={`isLoginComplete__error ${
                loginIsError && notifyVisibility ? '' : 'hidden'
              }`}
            >
              <RiErrorWarningLine />
              {errorMessages}
            </p>
          ) : (
            ''
          )}

          {loginIsSuccess && notifyVisibility ? (
            <p
              className={`isLoginComplete__success ${
                loginIsSuccess && notifyVisibility ? '' : 'hidden'
              }`}
            >
              <RiCheckboxCircleLine /> Авторизация выполнена
            </p>
          ) : (
            ''
          )}
          <div className="loginform__actions">
            {logInLoading ? (
              <ModalLoader />
            ) : (
              <Button
                id="login__btn"
                type="submit"
                text="Войти"
                action={authorization}
                disabled={username && password ? false : true}
              />
            )}
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default LoginForm;
