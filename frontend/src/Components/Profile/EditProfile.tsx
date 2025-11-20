//React
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";

//Hooks
import useStore from '@/hooks/useStore';

//3rd lib
import { Camera, Mail, User, AtSign } from 'lucide-react';
import { toast } from 'sonner';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

//UI
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  Input,
  Button,
} from "@/Components/ui";

// ------------------------------
// OWN Edit Profile Schema
// ------------------------------
const EditProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email"),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
  photo: z.any().optional(),
}).refine((data) =>
  data.password && data.confirmPassword
    ? data.password === data.confirmPassword
    : true,
  {
    path: ["confirmPassword"],
    message: "Passwords must match",
  }
);

type EditProfileData = z.infer<typeof EditProfileSchema>;

const EditProfile = () => {
  const { loggedInMember, isUpdatingProfile, editProfile } = useStore();

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // ------------------------------
  // react-hook-form
  // ------------------------------
  const form = useForm<EditProfileData>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      firstName: loggedInMember?.firstName || "",
      lastName: loggedInMember?.lastName || "",
      username: loggedInMember?.username || "",
      email: loggedInMember?.email || "",
      password: "",
      confirmPassword: "",
      photo: null,
    }
  });

  const { setValue } = form;

  // Sync when member data updates
  useEffect(() => {
    if (!loggedInMember) return;
    setValue("firstName", loggedInMember.firstName || "");
    setValue("lastName", loggedInMember.lastName || "");
    setValue("username", loggedInMember.username || "");
    setValue("email", loggedInMember.email || "");
  }, [loggedInMember, setValue]);

  // Handle photo
  const handlePhotoChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValue("photo", file);

    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Submit
  const onSubmit = form.handleSubmit(async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (v) formData.append(k, v as any);
    });

    const response = await editProfile(formData);

    if (response) toast.success("Profile edited successfully!");
    else toast.error("Error while editing!");
  });

  return (
    <div className="max-w-2xl mx-auto p-4 py-8">
      <div className="bg-base-300 rounded-xl p-6 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Edit Profile</h1>
          <p className="mt-2">Your profile information</p>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={previewImage || loggedInMember?.photo?.url}
              alt="Profile"
              className="size-32 rounded-full object-cover border-4"
            />

            <label
              htmlFor="avatar-upload"
              className={`
                absolute bottom-0 right-0 
                bg-base-content hover:scale-105
                p-2 rounded-full cursor-pointer 
                transition-all duration-200
                ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
              `}
            >
              <Camera className="w-5 h-5 text-base-200" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isUpdatingProfile}
                onChange={handlePhotoChange}
              />
            </label>
          </div>

          <p className="text-sm text-zinc-400">
            {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form className="space-y-6" onSubmit={onSubmit}>
            
            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="w-4 h-4" /> First Name
                  </FormLabel>
                  <FormControl>
                    <Input className="bg-base-200" placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="w-4 h-4" /> Last Name
                  </FormLabel>
                  <FormControl>
                    <Input className="bg-base-200" placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <AtSign className="w-4 h-4" /> Username
                  </FormLabel>
                  <FormControl>
                    <Input className="bg-base-200" placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email Address
                  </FormLabel>
                  <FormControl>
                    <Input className="bg-base-200" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Save button */}
            <Button
              type="submit"
              disabled={isUpdatingProfile}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              Save Changes
            </Button>

          </form>
        </Form>

        {/* Account Info */}
        <div className="mt-6 bg-base-300 rounded-xl p-6">
          <h2 className="text-lg font-medium mb-4">Account Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-zinc-700">
              <span>Member Since</span>
              <span>{loggedInMember?.createdAt?.split("T")[0]}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Account Status</span>
              <span className="text-green-500">Active</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EditProfile;
