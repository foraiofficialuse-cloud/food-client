import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { type Role } from "@/types";
import AdminLayout from "@/components/layout/AdminLayout";
import HotelLayout from "@/components/layout/HotelLayout";
import NGOLayout from "@/components/layout/NGOLayout";

interface Props {
  role: Role;
}

const layouts: Record<
  Role,
  React.ComponentType<{ children: React.ReactNode }>
> = {
  admin: AdminLayout,
  hotel: HotelLayout,
  ngo: NGOLayout,
};

export default function ProtectedRoute({ role }: Props) {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role && user.role !== "admin")
    return <Navigate to={`/${user.role}/dashboard`} replace />;

  const layoutKey: Role =
    user.role === "admin" && role !== "admin" ? "admin" : user.role;

  const Layout = layouts[layoutKey];

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
