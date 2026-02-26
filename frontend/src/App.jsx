import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { v4 as uuidv4 } from "uuid";
import InterviewRoute from "./components/InterviewRoute";
import Navbar from "./components/Navbar";
import UploadRoute from "./components/UploadRoute";
import Home from "./pages/HomePage";
import InterviewPage from "./pages/InterviewPage";
import SummaryPage from "./pages/SummaryPage";
import UploadPage from "./pages/UploadPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { setUserId, setInterviewId } from "./slices/generalInfo.slice";
import { pingServer } from "./util/pingServer";

function App() {
  const dispatch = useDispatch();
  const { userId, isAuthenticated, interviewId } = useSelector((state) => state.generalInfo);

  useEffect(() => {
    const loadingToast = toast.loading("Starting server...");

    const checkServer = async () => {
      try {
        await pingServer();
        toast.success("Server started successfully!", {
          id: loadingToast,
          duration: 3000,
        });
      } catch (err) {
        toast.error("Failed to start server", {
          id: loadingToast,
          duration: 3000,
        });
      }
    };

    checkServer()
  }, []);

  useEffect(() => {
    // Only generate anonymous userId if user is not authenticated and no userId exists
    if (!isAuthenticated && !userId) {
      const newId = uuidv4();
      dispatch(setUserId(newId));
    }
  }, [userId, isAuthenticated, dispatch]);

  useEffect(() => {
    // Clear interviewId once on app load (fresh start)
    dispatch(setInterviewId(null));
  }, [dispatch]);

  return (
    <div className="app-shell w-screen overflow-auto no-scrollbar no-select">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route
          path="/upload"
          element={
            <UploadRoute>
              <UploadPage />
            </UploadRoute>
          }
        />
        <Route
          path="/interview"
          element={
            <InterviewRoute>
              <InterviewPage />
            </InterviewRoute>
          }
        />
        <Route path="/summary" element={<SummaryPage />} />
        <Route path="/summary/:interviewId" element={<SummaryPage />} />
      </Routes>

      <Toaster
        position="top-center"
        richColors
        closeButton
        duration={4000}
      />
    </div>
  );
}

export default App;
