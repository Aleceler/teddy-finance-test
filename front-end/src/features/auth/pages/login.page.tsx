import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { useLogin } from '../hooks/useLogin';
import { loginSchema, type LoginFormValues } from '../schemas/login.schema';

export function LoginPage() {
  const { mutate, isPending } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-teddy-gray p-4">
      <div className="w-full max-w-xl">
        <h1 className="mb-8 text-center text-3xl font-medium text-neutral-900">
          Olá, seja bem-vindo!
        </h1>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit((values) => mutate(values))}
        >
          <Input
            placeholder="Digite o seu e-mail:"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            placeholder="Digite a sua senha:"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" isLoading={isPending} className="w-full">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}
