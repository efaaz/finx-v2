"use client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { logout } from "@/lib/api/auth";

export default function DashboardPage() {
  const {
    data: user,
    isPending,
    isError,
  } = useCurrentUser();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return null;
  }

  return (
    <main>
      <h1>
        Welcome, {user.name}
      </h1>
      <button onClick={() => logout()} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
        Logout
      </button>
    </main>
  );
}