import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

export default function InterviewRoute({ children }) {
  const { isResumeUploaded, isAuthenticated } = useSelector((state) => state.generalInfo);

  // Check if user is authenticated
  if (!isAuthenticated) {
    toast.error("Please login to access the interview");
    return <Navigate to="/login" replace />;
  }

  if (!isResumeUploaded) {
    return <Navigate to="/upload" replace />;
  }

  return children;
}