//REACT
import React from 'react';
import { useNavigate } from 'react-router-dom';

//COMPONENTS
import Button from '../ui/Button';

//CSS
import '../css/pages/NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notFound__container">
      <p id="notFound__icon">☹️</p>
      <h1>404 NOT FOUND</h1>
      <h3>К сожалению, страница, которую вы запрашиваете, не найдена.</h3>
      <Button text="Вернуться на главную" action={() => navigate('/')} />
    </div>
  );
};

export default NotFound;
