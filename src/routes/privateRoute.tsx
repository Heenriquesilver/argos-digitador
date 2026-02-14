import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../auth/useAuth";

interface Props {
  children: ReactNode;
}

export default function PrivateRoute({ children }: Props) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
