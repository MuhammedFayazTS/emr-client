import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { loginFormSchema, type LoginFormInput } from '../validation/auth.schema';
import { useLogin } from '../hooks/useLogin';
import DefaultTextInput from '@/shared/components/core/DefaultTextInput';
import { Button } from '@/shared/components/ui/button';

export default function LoginForm() {
  const navigate = useNavigate();
  const { mutate: login, isPending, error } = useLogin();

  const {
    control,
    handleSubmit,
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      // email: '',
      // password: '',
      email: "sarah@example.com",
      password: "SecurePass123!"
    },
  });

  const onSubmit = (values: LoginFormInput) => {
    login(values, {
      onSuccess: () => navigate('/dashboard'),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <DefaultTextInput
        control={control}
        name="email"
        label="Email"
        type="email"
        placeholder="Enter your email"
      />

      <DefaultTextInput
        control={control}
        name="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
      />

      {error && <p role="alert" className="text-sm font-normal text-destructive">{error.message}</p>}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Logging in…' : 'Log in'}
      </Button>
    </form>
  );
}
