import React, { useEffect, useState } from 'react';

import Button from '../ui/Button';
import { RiCloseCircleLine } from 'react-icons/ri';

const ModalWindow = ({ opened, action,  children, title }) => {
  //   console.log(children.props.children);
  console.log(React.Children.map(children, (child) => child));
  //   console.log(opened);

  return (
    <div className={`modal__container ${opened ? '' : 'ifHidden'}`}>
      <div className={`modal__window ${opened ? '' : 'ifHidden'}`}>
        <div id="modal__close">
          <RiCloseCircleLine onClick={action} />
        </div>
        <h1>{title}</h1>
        {React.Children.map(children, (child) => {
          return child;
        })}
        {/* <p
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
          className={`isLoginComplete__success ${
            isSuccess ? '' : 'hidden'
          }`}
        >
          <RiCheckboxCircleLine /> Авторизация выполнена
        </p> */}
      </div>
    </div>
  );
};

export default ModalWindow;
