import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { loginFormSchema, type LoginFormInput } from '../validation/auth.schema';
import { useLogin } from '../hooks/useLogin';

export default function LoginForm() {
  const navigate = useNavigate();
  const { mutate: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = (values: LoginFormInput) => {
    login(values, {
      onSuccess: () => navigate('/dashboard'),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register('email')} />
        {errors.email && <span role="alert">{errors.email.message}</span>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" {...register('password')} />
        {errors.password && <span role="alert">{errors.password.message}</span>}
      </div>

      {error && <p role="alert">{error.message}</p>}

      <button type="submit" disabled={isPending}>
        {isPending ? 'Logging in…' : 'Log in'}
      </button>
    </form>
  );
}
