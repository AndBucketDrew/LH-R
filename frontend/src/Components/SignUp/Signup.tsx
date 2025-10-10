import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useForm from '../../hooks/useForm';
import useStore from '../../hooks/useStore';
import { Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react';
import { toast } from 'sonner';
import useEnter from '@/hooks/useEnter';
// import ImageUploader from '../../constant/ImageUploader';

export type UserData = {
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  email: string;
  photo: unknown;
};

export function Signup() {
  const { memberSignup } = useStore((state) => state);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const navigate = useNavigate();

  const { formState, handleFormChange } = useForm<UserData>({
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    email: '',
    photo: null,
  });

  // Signup.tsx
  const handleSignup = async () => {
    if (formState.password !== formState.confirmPassword) {
      toast.warning('Passwords do not match!');
      return;
    }

    const formData = new FormData();
    formData.append('username', formState.username);
    formData.append('password', formState.password);
    formData.append('confirmPassword', formState.confirmPassword);
    formData.append('email', formState.email);
    formData.append('firstName', formState.firstName);
    formData.append('lastName', formState.lastName);
    formData.append('photo', formState.photo); // Send File object

    const response = await memberSignup(formData);

    if (response) {
      navigate('/login');
      toast.success('Successfully signed up. Welcome!');
    } else {
      toast.error('Error while signing up!');
    }
  };

  useEnter(handleSignup);

return (
    <div className="flex justify-center items-center h-[80vh] relative overflow-hidden pt-5">
      {/* Background horizontal box */}
      <div className="bg-secondary w-[85%] h-[280px] rounded-md flex items-center justify-end px-12">
        <div className="max-w-md">
          <h2 className="text-2xl font-semibold mb-3">
            Already have an account?
          </h2>
          <p className="text-sm mb-8 leading-relaxed">
            Banjo tote bag bicycle rights, High Life sartorial cray craft beer
            whatever street art fap.
          </p>
          <Button
            asChild
            variant="outline"
            className="px-6"
          >
            <Link to="/login">Log In</Link>
          </Button>
        </div>
      </div>

      {/* Floating signup card */}
      <Card className="absolute left-[10%] top-1/2 -translate-y-1/2 w-[450px] shadow-xl rounded-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg tracking-wide">
            SIGN UP
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* First Name */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="firstName">
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formState.firstName}
                onChange={handleFormChange}
                placeholder="Enter your first name"
              />
            </div>

            {/* Last Name */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="lastName">
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={formState.lastName}
                onChange={handleFormChange}
                placeholder="Enter your last name"
              />
            </div>

            {/* Username */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="username">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                value={formState.username}
                onChange={handleFormChange}
                placeholder="Enter your username"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                value={formState.email}
                onChange={handleFormChange}
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col space-y-1.5 relative">
              <Label htmlFor="password">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formState.password}
                onChange={handleFormChange}
                placeholder="Enter your password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-8 h-8 w-8 p-0 hover:bg-transparent"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col space-y-1.5 relative">
              <Label htmlFor="confirmPassword">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formState.confirmPassword}
                onChange={handleFormChange}
                placeholder="Confirm your password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-2 top-8 h-8 w-8 p-0 hover:bg-transparent"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Photo */}
            {/* <div className="flex flex-col space-y-1.5">
              <Label htmlFor="photo">
                Photo
              </Label>
              <ImageUploader
                handleFormChange={handleFormChange}
                photo={formState.photo}
              />
            </div> */}


            {/* Signup Button */}
            <Button
              onClick={handleSignup}
              className="uppercase tracking-wide w-full"
            >
              Sign Up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
