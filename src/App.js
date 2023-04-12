//REACT
import { Routes, Route } from 'react-router-dom';
import { routes } from './routes/routes.data';

//COMPONENTS
import { ToastContainer } from 'react-toastify';
import Header from './components/Header';
import Menu from './components/Menu';
import LoginForm from './components/LoginForm';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorScreen from './components/ErrorScreen';
import ModalLoader from './ui/ModalLoader';

//CSS
import './App.css';

function App() {
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
        <ModalLoader />
        <ToastContainer />
      </div>
    </div>
  );
}

export default App;
