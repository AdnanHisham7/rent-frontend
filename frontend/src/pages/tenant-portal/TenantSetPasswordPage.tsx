import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Input } from '@/components/ui';
import { useTenantSetPasswordMutation } from '@/store/api/tenantPortalApi';
import { useAppDispatch } from '@/store/hooks';
import { setTenantPortalCredentials } from '@/store/slices/tenantPortalAuthSlice';

const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
type FormValues = z.infer<typeof schema>;

export default function TenantSetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [showPassword, setShowPassword] = useState(false);
  const [setPassword, { isLoading }] = useTenantSetPasswordMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    if (!token) {
      toast.error('This setup link is missing its token.');
      return;
    }
    try {
      const res = await setPassword({ token, password: values.password }).unwrap();
      dispatch(setTenantPortalCredentials(res.data));
      toast.success('Password set — welcome to your tenant portal!');
      navigate('/tenant-portal', { replace: true });
    } catch (err: any) {
      toast.error(err?.data?.message ?? 'Could not set your password. The link may have expired.');
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <h1 className="font-display text-xl font-semibold text-ink">Invalid link</h1>
        <p className="mt-2 text-sm text-ink-soft">This setup link is missing or malformed. Please use the link from your welcome email.</p>
        <Link to="/tenant-portal/login" className="mt-4 inline-block text-sm font-medium text-crimson-600 hover:underline">Go to login</Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-sage-50 text-sage-500">
        <ShieldCheck className="size-5" />
      </div>
      <h1 className="font-display text-2xl font-semibold text-ink">Set up your portal</h1>
      <p className="mt-1.5 text-sm text-ink-soft">Choose a password to activate your tenant portal access.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
        <Input
          label="New password"
          type={showPassword ? 'text' : 'password'}
          placeholder="At least 8 characters"
          leftIcon={<Lock className="size-4" />}
          rightIcon={
            <button type="button" onClick={() => setShowPassword((s) => !s)} className="pointer-events-auto text-ink-faint hover:text-ink">
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          }
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirm password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Re-enter your password"
          leftIcon={<Lock className="size-4" />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <Button type="submit" loading={isLoading} className="mt-2 justify-center">Set password &amp; continue</Button>
      </form>
    </motion.div>
  );
}
