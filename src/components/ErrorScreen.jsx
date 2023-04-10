import { useNavigate } from 'react-router-dom';

import Button from '../ui/Button';

const ErrorScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="notFound__container">
      <p id="notFound__icon">☹️</p>
      <h1>Произошла какая-то ошибка.</h1>
      <h3>
        Попробуйте перезагрузить страницу. Если проблема не решится, обратитесь
        к администратору.
      </h3>
      <Button text="Вернуться на главную" action={() => navigate('/')} />
    </div>
  );
};

export default ErrorScreen;
