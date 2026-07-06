import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ROUTES } from '../../../config/routes';
import { useAuthStore } from '../../../stores/auth.store';
import { authApi } from '../api/auth.api';
import type { LoginFormValues } from '../schemas/login.schema';

export function useLogin() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (payload: LoginFormValues) => authApi.login(payload),
    onSuccess: (response) => {
      login(response.accessToken, response.user);
      toast.success('Login realizado com sucesso');
      navigate(ROUTES.CLIENTS);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Falha na autenticação');
    },
  });
}
