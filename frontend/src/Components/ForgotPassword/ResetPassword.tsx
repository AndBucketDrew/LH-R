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

  const { formState, handleFormChange } = useForm<UserData>({
    email: '',
  });

  const handleReset = async () => {
    // Attempt login
    const result = await memberResetPassword(formState);

    if (result) {
      setEmailSent(true);

      // Navigate to dashboard on successful login
      toast.success('Email sent!');
    } else {
      toast.success('Email sent!, but no email!');
      setEmailSent(true);
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh] relative overflow-hidden pt-5">
      {!emailSent ? (
        <>
          {/* Background dark horizontal box */}
          <div className="bg-secondary w-[85%] h-[280px] rounded-md flex items-center justify-between px-12">
            <div className="max-w-md">
              <h2 className="text-2xl font-semibold mb-3">Forgot your password?</h2>
              <p className="text-sm mb-8 leading-relaxed">
                No problem! Just enter your email, we will send you a link where you can reset your
                password!
              </p>
            </div>
          </div>

          {/* Floating login card */}
          <Card className="absolute right-[10%] top-1/2 -translate-y-1/2 w-[450px] shadow-xl rounded-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg tracking-wide">Enter your Email Address</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
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

                <Button onClick={handleReset} className="uppercase tracking-wide w-full">
                  Log In
                </Button>
              </div>
            </CardContent>
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
