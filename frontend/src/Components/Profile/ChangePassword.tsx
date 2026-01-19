import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { KeyRound, Lock, EyeIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useStore } from '@/hooks';
import { useEnter } from '@/hooks';

import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
  Input,
  Button,
} from '@/Components/ui';

import type { PasswordData } from '@/models/member.model';

const ChangePassword = () => {
  const { t } = useTranslation();
  const { loggedInMember, isUpdatingProfile, memberChangePassword, memberLogout } = useStore();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const ChangePasswordSchema = z
    .object({
      oldPassword: z.string().min(1, t('oldPasswordRequired')),
      newPassword: z.string().min(6, t('newPasswordMin')).min(1, t('newPasswordRequired')),
      confirmPassword: z.string().min(1, t('confirmPasswordRequired')),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('passwordsMatchError'),
      path: ['confirmPassword'],
    });

  type ChangePasswordData = z.infer<typeof ChangePasswordSchema>;

  const toggleOldPasswordVisibility = () => setShowOldPassword((prev) => !prev);
  const toggleNewPasswordVisibility = () => setShowNewPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

  const form = useForm<ChangePasswordData>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { setError } = form;

  const handleChangePassword = form.handleSubmit(async (values) => {
    const passwordData: PasswordData = {
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    };

    try {
      const response = await memberChangePassword(passwordData);

      if (response) {
        toast.success(t('passwordChangeSuccess'));
        setTimeout(() => {
          memberLogout();
        }, 1000);
      } else {
        toast.error(t('passwordChangeError'));
      }
    } catch (error) {
      const { alert } = useStore.getState();
      const msg = alert?.description?.toLowerCase();

      if (msg?.includes('old password')) {
        setError('oldPassword', {
          type: 'manual',
          message: alert?.description || t('oldPasswordRequired'),
        });
      } else {
        setError('root', {
          type: 'manual',
          message: alert?.description || t('passwordChangeError'),
        });
      }
    }
  });

  useEnter(handleChangePassword);

  return (
    <div className="max-w-2xl mx-auto p-4 py-8">
      <div className="bg-base-300 rounded-xl p-6 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">{t('changePassword')}</h1>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={`${loggedInMember?.photo?.url}?tr=w-128,h-128,cm-round,cq-95,sh-20,q-95,f-auto`}
              alt="Profile Picture"
              className="size-32 rounded-full object-cover border-4"
            />
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={handleChangePassword} className="space-y-6">
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-zinc-400 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    {t('oldPassword')}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showOldPassword ? 'text' : 'password'}
                        placeholder={t('oldPassword')}
                        className={`px-4 py-2.5 bg-base-200 rounded-lg border w-full placeholder-zinc-700 pr-10 ${
                          form.formState.errors.oldPassword ? 'border-red-500 shake' : ''
                        }`}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={toggleOldPasswordVisibility}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-transparent"
                      >
                        <EyeIcon className="h-5 w-5 text-zinc-400" />
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-zinc-400 flex items-center gap-2">
                    <KeyRound className="w-4 h-4" />
                    {t('newPassword')}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder={t('newPassword')}
                        className={`px-4 py-2.5 bg-base-200 rounded-lg border w-full placeholder-zinc-700 pr-10 ${
                          form.formState.errors.newPassword ? 'border-red-500 shake' : ''
                        }`}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={toggleNewPasswordVisibility}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-transparent"
                      >
                        <EyeIcon className="h-5 w-5 text-zinc-400" />
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-zinc-400 flex items-center gap-2">
                    <KeyRound className="w-4 h-4" />
                    {t('confirmPassword')}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder={t('confirmPassword')}
                        className={`px-4 py-2.5 bg-base-200 rounded-lg border w-full placeholder-zinc-700 pr-10 ${
                          form.formState.errors.confirmPassword ? 'border-red-500 shake' : ''
                        }`}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-transparent"
                      >
                        <EyeIcon className="h-5 w-5 text-zinc-400" />
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <p className="text-xs text-red-500">{form.formState.errors.root.message}</p>
            )}

            <div className="mt-6 bg-base-300 rounded-xl p-6">
              <h2 className="text-lg font-medium mb-4">{t('accountInfo')}</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                  <span>{t('memberSince')}</span>
                  <span>{loggedInMember?.createdAt?.split('T')[0]}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>{t('accountStatus')}</span>
                  <span className="text-green-500">{t('statusActive')}</span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isUpdatingProfile}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {t('updateAndLogout')}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ChangePassword;
