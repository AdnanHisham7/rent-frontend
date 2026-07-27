import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Input } from '@/components/ui';
import { useTenantLoginMutation } from '@/store/api/tenantPortalApi';
import { useAppDispatch } from '@/store/hooks';
import { setTenantPortalCredentials } from '@/store/slices/tenantPortalAuthSlice';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type FormValues = z.infer<typeof schema>;

export default function TenantLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useTenantLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await login(values).unwrap();
      dispatch(setTenantPortalCredentials(res.data));
      const from = (location.state as { from?: string })?.from;
      toast.success(`Welcome, ${res.data.tenant.firstName}`);
      navigate(from ?? '/tenant-portal', { replace: true });
    } catch (err: any) {
      toast.error(err?.data?.message ?? 'Could not sign in. Check your credentials.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="font-display text-2xl font-semibold text-ink">Tenant Portal</h1>
      <p className="mt-1.5 text-sm text-ink-soft">Sign in to view your dues, payments and documents.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
        <Input label="Email" type="email" placeholder="you@example.com" leftIcon={<Mail className="size-4" />} error={errors.email?.message} {...register('email')} />
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          leftIcon={<Lock className="size-4" />}
          rightIcon={
            <button type="button" onClick={() => setShowPassword((s) => !s)} className="pointer-events-auto text-ink-faint hover:text-ink">
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          }
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" loading={isLoading} iconRight={<ArrowRight className="size-4" />} className="mt-2 justify-center">
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-ink-faint">
        Haven't set up your portal access yet? Check your email for a setup link from your property manager, or{' '}
        <Link to="/" className="font-medium text-crimson-600 hover:underline">visit our site</Link>.
      </p>
    </motion.div>
  );
}
