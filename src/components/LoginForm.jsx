import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  RiCloseCircleLine,
  RiCheckboxCircleLine,
  RiErrorWarningLine,
} from 'react-icons/ri';
import { CSSTransition } from 'react-transition-group';
import {
  toggleLoginForm,
  setToken,
  setUsername,
} from '../redux/slices/loginFormSlice';
import { useLogInMutation } from '../services/authApi';
import Button from '../ui/Button';

import '../css/components/LoginForm.css';

const LoginForm = () => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const isOpened = useSelector((state) => state.login.isOpened);
  const dispatch = useDispatch();

  const onClickClose = () => {
    dispatch(toggleLoginForm());
  };

  //   -------------- LOGIN FORM CLOSING WHEN CLICKED OUTSIDE-----------------  //
  const loginFormContainerRef = useRef();
  const loginFormRef = useRef();

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     const isLoginForm = event.composedPath().includes(loginFormRef.current);
  //     if (!isLoginForm) {
  //       dispatch(toggleLoginForm());
  //     }
  //   };
  //   if (loginFormContainerRef) {
  //     loginFormContainerRef.current.addEventListener(
  //       'click',
  //       handleClickOutside
  //     );
  //   }
  //   return () =>
  //     loginFormContainerRef.current.removeEventListener(
  //       'click',
  //       handleClickOutside
  //     );
  // }, [loginFormContainerRef]);

  //   -------------------- LOGIN FORM AUTHORIZATION ------------------------ //
  const [logIn, { data, error, isError, status, isSuccess }] =
    useLogInMutation();
  const authorization = async () => {
    await logIn({
      password,
      username,
    }).unwrap();
  };

  //--- TOKEN SAVING ---//

  const setUserData = () => {
    dispatch(setToken(data.auth_token));
    dispatch(setUsername(username));
  };
  useEffect(() => {
    if (isSuccess) {
      setUserData();
      setTimeout(() => onClickClose(), 3000);
    }
  }, [isSuccess]);
  // console.log('SUCCESS', isSuccess);
  // console.log('DATA FROM LogIn QUERY', data);
  // console.log('QUERY STATUS', status);
  // console.log('ERROR OCCURED', error);
  // console.log('ERROR OR NOT', isError);

  return (
    <CSSTransition
      in={isOpened}
      timeout={200}
      classNames="my-node"
      unmountOnExit
    >
      <div
        ref={loginFormContainerRef}
        className={`loginform__container ${isOpened ? '' : 'ifHidden'}`}
      >
        <div
          ref={loginFormRef}
          action=""
          className={`login__form ${isOpened ? '' : 'ifHidden'}`}
          id="login"
        >
          <div id="loginform__close">
            <RiCloseCircleLine onClick={onClickClose} />
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
              />
              <i className="bx bx-lock-open-alt"></i>
            </div>
          </div>

          <p
            className={`isLoginComplete__error ${
              isError && error.status === 400 ? '' : 'hidden'
            }`}
          >
            <RiErrorWarningLine />
            Введен неверный логин или пароль
          </p>

          <p
            className={`isLoginComplete__error ${
              isError && error.originalStatus > 400 ? '' : 'hidden'
            }`}
          >
            <RiErrorWarningLine />
            Ошибка {isError && error.originalStatus}. Повторите попытку
          </p>

          <p
            className={`isLoginComplete__success ${isSuccess ? '' : 'hidden'}`}
          >
            <RiCheckboxCircleLine /> Авторизация выполнена
          </p>

          <Button
            id="login__btn"
            type="submit"
            text="Войти"
            action={authorization}
            disabled={username && password ? false : true}
          />
        </div>
      </div>
    </CSSTransition>
  );
};

export default LoginForm;
