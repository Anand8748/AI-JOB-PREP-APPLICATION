import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

export default function UploadRoute({ children }) {
  const { isResumeUploaded, isChatStarted, isAuthenticated } = useSelector((state) => state.generalInfo);

  // Check if user is authenticated
  if (!isAuthenticated) {
    toast.error("Please login to start an interview");
    return <Navigate to="/login" replace />;
  }

  if (isResumeUploaded && isChatStarted) {
    return <Navigate to="/interview" replace />;
  }

  return children;
}