import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useState } from 'react';
import useForm from '../../hooks/useForm';
import useStore from '../../hooks/useStore';
import { toast } from 'sonner';

type UserData = {
  email: string;
};

export function ResetPassword() {
  const { memberResetPassword } = useStore((state) => state);
  const [emailSent, setEmailSent] = useState(false);
  const { formState, handleFormChange } = useForm<UserData>({ email: '' });

  const handleReset = async () => {
    if (!formState.email) {
      toast.warning('Please enter your email address.');
      return;
    }

    try {
      await memberResetPassword({ email: formState.email });
      toast.success('Password reset link sent! Check your email.');
      setEmailSent(true);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset link');
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh] relative overflow-hidden pt-5">
      {!emailSent ? (
        <>
          <div className="background-box bg-secondary w-[85%] h-[280px] rounded-md flex items-center justify-between px-12 overflow-hidden">
            <div className="max-w-md">
              <h2 className="text-2xl font-semibold mb-3">Forgot your password?</h2>
              <p className="text-sm mb-8 leading-relaxed">
                No problem! Just enter your email, we will send you a link where you can reset your
                password!
              </p>
            </div>
          </div>

          <Card className="absolute right-[10%] top-1/2 -translate-y-1/2 w-[450px] h-[380px] shadow-xl rounded-md transition-all duration-700 ease-in-out max-[1300px]:h-[300px] max-[1300px]:right-0 max-[1300px]:left-1/2 max-[1300px]:-translate-x-1/2">
            <div className="space-y-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg tracking-wide">Enter your Email Address</CardTitle>
            </CardHeader>

            <CardContent className="h-full flex flex-col justify-center space-y-4">
              <div className="space-y-8">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="email" className="text-sm text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleFormChange}
                    placeholder="Enter your email"
                    className="border-gray-300 focus-visible:ring-red-300"
                  />
                </div>

                <Button
                  onClick={async () => {
                    setEmailSent(true); // always show success UI
                    try {
                      await handleReset(); // still perform request
                    } catch (err) {
                      console.error(err); // never expose error to user
                    }
                  }}
                  className="uppercase tracking-wide w-full"
                >
                  Send Reset Link
                </Button>
              </div>
            </CardContent>
            </div>

          </Card>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Check your email</h2>
          <p className="text-sm text-gray-600">We’ve sent a link to reset your password.</p>
        </div>
      )}
    </div>
  );
}
