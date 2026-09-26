"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toast";
import { type CurrentUser } from "@/types/auth";
import {
  Mail,
  Camera,
  LockKeyhole,
  ShieldCheck,
  Check,
  Loader2,
  Eye,
  EyeOff,
  User,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  profileSchema,
  passwordSchema,
  type ProfileFormValues,
  type PasswordFormValues,
} from "@/Schema/userSettingsSchema";


const API = {
  updateProfile: "/auth/users/update-account",
  updateProfilePicture: "/auth/users/update-avatar",
  changePassword: "/auth/users/change-password",
};

export default function SettingsPage() {
  const { data: user, isPending } = useCurrentUser();

  if (isPending) {
    return (
      <main className="min-h-screen text-slate-100">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex min-h-100 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#050914] text-slate-100">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-center text-slate-400">
            Unable to load your profile.
          </p>
        </div>
      </main>
    );
  }

  return <SettingsContent user={user as CurrentUser} />;
}

type SettingsContentProps = {
  user: CurrentUser;
};

function SettingsContent({ user }: SettingsContentProps) {
  const queryClient = useQueryClient();

  const [avatarPreview, setAvatarPreview] = useState(user.avatar || "");

  const [profileMessage, setProfileMessage] = useState("");
  const [avatarMessage, setAvatarMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const updateProfileMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const response = await api.patch(API.updateProfile, values);

      return response.data;
    },

    onSuccess: () => {
      setProfileMessage("Profile updated successfully.");

      toast.add({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
        type: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });

      setTimeout(() => {
        setProfileMessage("");
      }, 3000);
    },

    onError: (error: any) => {
      setProfileMessage(
        error?.response?.data?.message || "Failed to update profile.",
      );
    },
  });

  const updateAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();

      formData.append("avatar", file);

      const response = await api.patch(API.updateProfilePicture, formData);

      return response.data;
    },

    onSuccess: (data) => {
      const newImage =
        data?.data?.avatar ||
        data?.avatar ||
        data?.data?.profilePicture ||
        data?.profilePicture;

      if (newImage) {
        setAvatarPreview(newImage);
      }

      setAvatarMessage("Profile picture updated successfully.");

      toast.add({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully.",
        type: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });

      setTimeout(() => {
        setAvatarMessage("");
      }, 3000);
    },

    onError: (error: any) => {
      setAvatarMessage(
        error?.response?.data?.message || "Failed to update profile picture.",
      );
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (values: PasswordFormValues) => {
      const response = await api.patch(API.changePassword, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      return response.data;
    },

    onSuccess: () => {
      setPasswordMessage("Password changed successfully.");

      toast.add({
        title: "Password changed",
        description: "Your password has been changed successfully.",
        type: "success",
      });

      passwordForm.reset();

      setTimeout(() => {
        setPasswordMessage("");
      }, 3000);
    },

    onError: (error: any) => {
      console.error("Error changing password:", error);
      setPasswordMessage(
        error?.response?.data?.message || "Failed to change password.",
      );
    },
  });

  const handleProfileSubmit = (values: ProfileFormValues) => {
    setProfileMessage("");
    updateProfileMutation.mutate(values);
  };

  const handlePasswordSubmit = (values: PasswordFormValues) => {
    setPasswordMessage("");
    changePasswordMutation.mutate(values);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setAvatarMessage("Image must be smaller than 5 MB.");

      return;
    }

    if (!file.type.startsWith("image/")) {
      setAvatarMessage("Please select a valid image file.");

      return;
    }

    // Local preview without createObjectURL
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatarPreview(reader.result);
      }
    };

    reader.readAsDataURL(file);

    setAvatarMessage("");

    updateAvatarMutation.mutate(file);

    // Allows selecting the same file again
    event.target.value = "";
  };

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="min-h-screen text-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/5 px-3 py-1 text-xs font-medium text-violet-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            Account settings
          </div>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Settings
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
            Manage your profile information, profile picture, and account
            security.
          </p>
        </div>

        <div className="space-y-6">
          {/* ================= PROFILE ================= */}

          <Card className="overflow-hidden border-white/8 bg-card shadow-2xl shadow-black/10 backdrop-blur-xl">
            <CardHeader className="border-b border-white/6 px-6 py-6">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-violet-400" />
                Profile
              </CardTitle>

              <CardDescription className="text-slate-400">
                Update your basic account information.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              {/* Avatar */}

              <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="relative">
                  <Avatar className="h-24 w-24 border border-white/10 shadow-lg shadow-violet-500/10">
                    <AvatarImage src={avatarPreview} alt={user.name} />

                    <AvatarFallback className="bg-linear-to-br from-violet-500/30 to-cyan-500/20 text-xl text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <label
                    htmlFor="avatar-upload"
                    className="absolute -bottom-1 -right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-[#101827] text-slate-200 shadow-lg transition hover:bg-[#172033]"
                  >
                    {updateAvatarMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                  </label>

                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={updateAvatarMutation.isPending}
                    className="hidden"
                  />
                </div>

                <div>
                  <h3 className="font-medium text-slate-100">
                    Profile picture
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    JPG, PNG or WEBP. Maximum size 5 MB.
                  </p>

                  {avatarMessage && (
                    <div
                      className={`mt-3 flex items-center gap-2 text-sm ${
                        updateAvatarMutation.isError
                          ? "text-red-400"
                          : "text-emerald-400"
                      }`}
                    >
                      <Check className="h-4 w-4" />
                      {avatarMessage}
                    </div>
                  )}
                </div>
              </div>

              <Separator className="mb-8 bg-white/6" />

              {/* Profile form */}

              <form
                onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
                className="space-y-6"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Name */}

                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>

                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                      <Input
                        id="name"
                        {...profileForm.register("name")}
                        className="border-white/8 bg-[#101827] pl-10 text-slate-100 placeholder:text-slate-600 focus-visible:ring-violet-500/50"
                        placeholder="Your name"
                      />
                    </div>

                    {profileForm.formState.errors.name && (
                      <p className="text-xs text-red-400">
                        {profileForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>

                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                      <Input
                        id="email"
                        type="email"
                        {...profileForm.register("email")}
                        className="border-white/8 bg-[#101827] pl-10 text-slate-100 placeholder:text-slate-600 focus-visible:ring-violet-500/50"
                        placeholder="you@example.com"
                      />
                    </div>

                    {profileForm.formState.errors.email && (
                      <p className="text-xs text-red-400">
                        {profileForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                  {profileMessage && (
                    <div className="flex items-center gap-2 text-sm text-emerald-400 sm:mr-auto">
                      <Check className="h-4 w-4" />
                      {profileMessage}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="bg-violet-600 text-white hover:bg-violet-500"
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save changes"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* ================= SECURITY ================= */}

          <Card className="overflow-hidden border-white/8 bg-card shadow-2xl shadow-black/10 backdrop-blur-xl">
            <CardHeader className="border-b border-white/6 px-6 py-6">
              <CardTitle className="flex items-center gap-2 text-lg">
                <LockKeyhole className="h-5 w-5 text-cyan-400" />
                Security
              </CardTitle>

              <CardDescription className="text-slate-400">
                Change your account password.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <form
                onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                className="space-y-6"
              >
                <PasswordInput
                  id="currentPassword"
                  label="Current password"
                  placeholder="Enter your current password"
                  show={showCurrentPassword}
                  setShow={setShowCurrentPassword}
                  error={passwordForm.formState.errors.currentPassword?.message}
                  {...passwordForm.register("currentPassword")}
                />

                <Separator className="bg-white/6" />

                <div className="grid gap-6 md:grid-cols-2">
                  <PasswordInput
                    id="newPassword"
                    label="New password"
                    placeholder="Enter a new password"
                    show={showNewPassword}
                    setShow={setShowNewPassword}
                    error={passwordForm.formState.errors.newPassword?.message}
                    {...passwordForm.register("newPassword")}
                  />

                  <PasswordInput
                    id="confirmPassword"
                    label="Confirm new password"
                    placeholder="Repeat your new password"
                    show={showConfirmPassword}
                    setShow={setShowConfirmPassword}
                    error={
                      passwordForm.formState.errors.confirmPassword?.message
                    }
                    {...passwordForm.register("confirmPassword")}
                  />
                </div>

                <div className="rounded-xl border border-white/6 bg-[#101827]/70 p-4">
                  <p className="text-sm font-medium text-slate-200">
                    Password requirements
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Use at least 8 characters.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                  {passwordMessage && (
                    <div className="flex items-center gap-2 text-sm text-emerald-400 sm:mr-auto">
                      <Check className="h-4 w-4" />
                      {passwordMessage}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={changePasswordMutation.isPending}
                    className="bg-cyan-600 text-white hover:bg-cyan-500"
                  >
                    {changePasswordMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Change password"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

// ==================================================
// Password Input
// ==================================================

type PasswordInputProps = {
  id: string;
  label: string;
  placeholder: string;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

function PasswordInput({
  id,
  label,
  placeholder,
  show,
  setShow,
  error,
  ...props
}: PasswordInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      <div className="relative">
        <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

        <Input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className="border-white/8 bg-[#101827] pl-10 pr-11 text-slate-100 placeholder:text-slate-600 focus-visible:ring-cyan-500/50"
          {...props}
        />

        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
