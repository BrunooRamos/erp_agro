import { AppRouter } from "./router/AppRouter"
import { ToastContainer } from 'react-toastify';

export const AgroModule = () => {

  return (
    <>
      <AppRouter />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  
  )
}


