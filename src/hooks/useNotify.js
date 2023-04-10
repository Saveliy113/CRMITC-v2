import { toast } from 'react-toastify';

const useNotify = () => {
  const notify = ({ message, type }) => {
    if (type === 'error') {
      toast.error(`${message}`, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'light',
      });
    }

    if (type === 'success') {
      toast.success(`${message}`, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'light',
      });
    }
  };

  return { notify };
};

export default useNotify;
