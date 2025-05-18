import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { startLoginWithEmailPassword } from '../../../store/auth/thunks';

interface LoginForm {
  user: string;
  password: string;
}

// Helper de rate limiting
const isLoginRateLimited = (): { limited: boolean, remainingTime: number } => {
  const RATE_LIMIT = {
    maxAttempts: 5,
    windowMs: 5 * 60 * 1000 // 5 minutos
  };
  
  const now = Date.now();
  const attempts = JSON.parse(localStorage.getItem('loginAttempts') || '[]') as number[];
  const validAttempts = attempts.filter(time => now - time < RATE_LIMIT.windowMs);
  
  if (validAttempts.length >= RATE_LIMIT.maxAttempts) {
    const oldestAttempt = Math.min(...validAttempts);
    const remainingTime = RATE_LIMIT.windowMs - (now - oldestAttempt);
    return { limited: true, remainingTime };
  }
  
  return { limited: false, remainingTime: 0 };
};

// Helper para registrar un intento
const recordLoginAttempt = () => {
  const now = Date.now();
  const attempts = JSON.parse(localStorage.getItem('loginAttempts') || '[]') as number[];
  attempts.push(now);
  localStorage.setItem('loginAttempts', JSON.stringify(attempts));
};

export const LoginPage = () => {
  // Hooks form -> react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  // State para mensajes de rate limiting
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null);

  // Hooks store -> redux
  const dispatch = useAppDispatch();

  // Hooks store -> redux 
  const { status, errorMessage } = useAppSelector(state => state.auth);

  // Verificar rate limiting al cargar el componente
  useMemo(() => {
    const { limited, remainingTime } = isLoginRateLimited();
    if (limited) {
      const minutes = Math.ceil(remainingTime / 60000);
      setRateLimitMessage(
        `Too many login attempts. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`
      );
    } else {
      setRateLimitMessage(null);
    }
  }, [status]);

  // Function to handle the form submission
  const onSubmit = handleSubmit((data) => {
    // Verificar rate limiting
    const { limited, remainingTime } = isLoginRateLimited();
    if (limited) {
      const minutes = Math.ceil(remainingTime / 60000);
      setRateLimitMessage(
        `Too many login attempts. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`
      );
      return;
    }
    
    // Registrar intento
    recordLoginAttempt();
    
    // Intentar login
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

              {/* Rate Limit Message */}
              {rateLimitMessage && (
                <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                  <p>{rateLimitMessage}</p>
                </div>
              )}

              {/* Add Error Message Display */}
              {errorMessage && !rateLimitMessage && (
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
                    disabled={isCheckingAuthentication || !!rateLimitMessage}
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
