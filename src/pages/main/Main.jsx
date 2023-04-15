//COMPONENTS
import { useSelector } from 'react-redux';
import Statistics from './Statistics';

const Main = () => {
  const token = useSelector((store) => store.login.token);
  return (
    <>
      {token ? (
        <Statistics />
      ) : (
        <div id="hello-text">
          <h1>
            Привет! Ты зашел в CRM-систему ITC Bootcamp. Чтобы продолжить
            работу, необходимо выполнить авторизацию.
          </h1>
        </div>
      )}
    </>
  );
};

export default Main;
