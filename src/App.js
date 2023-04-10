//REACT
import { Routes, Route } from 'react-router-dom';

//COMPONENTS
import Header from './components/Header';
import Menu from './components/Menu';
import LoginForm from './components/LoginForm';
import { ToastContainer } from 'react-toastify';
import { routes } from './routes/routes.data';

//CSS
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorScreen from './components/ErrorScreen';
import formatDate from './utils/formatDate';

function App() {
  console.log(formatDate('2023-04-08T11:32:56.324879+06:00'));
  return (
    <div className="App">
      <Menu />
      <LoginForm />
      <div className="content">
        <Header />
        <Routes>
          {routes.map((route) => {
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <ErrorBoundary key={route.path} fallback={<ErrorScreen />}>
                    <route.component />
                  </ErrorBoundary>
                }
              />
            );
          })}
        </Routes>
        <ToastContainer />
      </div>
    </div>
  );
}

export default App;
