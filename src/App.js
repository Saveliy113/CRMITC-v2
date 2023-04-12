//REACT
import { Routes, Route } from 'react-router-dom';
import { routes } from './routes/routes.data';

//COMPONENTS
import { ToastContainer, toast } from 'react-toastify';
import Header from './components/Header';
import Menu from './components/Menu';
import LoginForm from './components/LoginForm';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorScreen from './components/ErrorScreen';

//CSS
import './App.css';

// toast.configure()
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
        <ToastContainer />
      </div>
    </div>
  );
}

export default App;
