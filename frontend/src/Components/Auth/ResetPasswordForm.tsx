import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

// Hooks
import { useStore } from '@/hooks';

// 3rd lib
import { toast } from 'sonner';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { clsx } from 'clsx';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
  Input,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/Components/ui';

export function ResetPasswordForm() {
  const { t } = useTranslation();
  const { memberResetPassword } = useStore((state) => state);
  const [emailSent, setEmailSent] = useState(false);

  const ResetSchema = z.object({
    email: z.string().min(1, t('emailReq')).email(t('invalidEmail')),
  });

  type ResetData = z.infer<typeof ResetSchema>;

  const form = useForm<ResetData>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleReset = form.handleSubmit(async (values) => {
    try {
      await memberResetPassword({ email: values.email });
      toast.success(t('resetLinkSentToast'));
      setEmailSent(true);
    } catch (error: any) {
      form.setError('root', {
        type: 'manual',
        message: error.message || t('somethingWentWrong'),
      });
    }
  });

  return (
    <div className="flex justify-center items-center h-[80vh] relative overflow-hidden pt-5">
      {!emailSent ? (
        <>
          <div className="background-box bg-secondary w-[85%] h-[280px] rounded-md flex items-center justify-between px-12 overflow-hidden">
            <div className="max-w-md">
              <h2 className="text-2xl font-semibold mb-3">{t('forgotYourPassword')}</h2>
              <p className="text-sm mb-8 leading-relaxed">{t('resetDescription')}</p>
            </div>
          </div>

          <Card
            className="
            absolute right-[10%] top-1/2 -translate-y-1/2 w-[450px] h-[380px] shadow-xl rounded-md transition-all duration-700 ease-in-out 
            max-[1300px]:h-[300px] max-[700px]:w-full max-[1300px]:right-0 max-[1300px]:left-1/2 max-[1300px]:-translate-x-1/2"
          >
            <Form {...form}>
              <form onSubmit={handleReset} className="h-full flex flex-col justify-center">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg tracking-wide">{t('enterEmailAddress')}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-8">
                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>{t('email')}</FormLabel>
                          <FormMessage className="text-xs">
                            <span>
                              {form.formState.errors.email?.message ||
                                form.formState.errors.root?.message}
                            </span>
                          </FormMessage>
                        </div>
                        <FormControl>
                          <Input
                            placeholder={t('enterEmail')}
                            className={clsx(
                              (form.formState.errors.email || form.formState.errors.root) &&
                                'border border-red-500 shake'
                            )}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="uppercase tracking-wide w-full">
                    {t('sendResetLink')}
                  </Button>
                </CardContent>
              </form>
            </Form>
          </Card>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">{t('checkYourEmail')}</h2>
          <p className="text-sm text-gray-600">{t('resetLinkSentDesc')}</p>
        </div>
      )}
    </div>
  );
}
