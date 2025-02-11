import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxConfig';
import { startLoginWithEmailPassword } from '../../../store/auth/thunks';

interface LoginForm {
  user: string;
  password: string;
}

export const LoginPage = () => {
  // Hooks form -> react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  // Hooks store -> redux
  const dispatch = useAppDispatch();

  // Hooks store -> redux 
  const { status, errorMessage  } = useAppSelector( state => state.auth );

  // Function to handle the form submission
  const onSubmit = handleSubmit((data) => {
    console.log('Form Data:', data);
    dispatch(startLoginWithEmailPassword(data));
  });
  
  // Memo to check if the user is checking the authentication
  const isCheckingAuthentication = useMemo(() => status === 'checking', [status]); 

  return (
    <div className="min-h-screen bg-zinc-300 p-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-semibold mb-4">Login</h1>
          <form onSubmit={onSubmit} className="w-full max-w-md mx-auto">
            <div className="w-full max-w-md mx-auto">

              {/* Email Field */}
              <div className="mb-4">
                <input
                  {...register('user', {
                    required: 'This field is required',
                  })}
                  name="user"
                  placeholder="admin"
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                />
                {errors.user && (
                  <p className="text-red-500 text-sm mt-1">{errors.user.message}</p>
                )}
              </div>


              {/* Password Field */}
              <div className="mb-4">
                <input
                  {...register('password', {
                    required: 'This field is required',
                    minLength: {
                      value: 5,
                      message: 'The password must have at least 5 characters',
                    },
                  })}
                  type="password"
                  name="password"
                  placeholder="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Add Error Message Display */}
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  <p>{errorMessage}</p>
                </div>
              )}


              {/* Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 mt-4">

                <div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-zinc-800 text-white rounded-sm hover:bg-zinc-900 focus:outline-none transition-colors"
                    disabled={ isCheckingAuthentication }
                  >
                    login
                  </button>
                </div>

              </div>
            </div>
          </form>
      </div>
    </div>
  );
};
