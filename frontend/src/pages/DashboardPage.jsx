import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useApi } from "../utils/api.js";

const DashboardPage = () => {
  const { userName, isAuthenticated } = useSelector((state) => state.generalInfo);
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchSummaries = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/summaries");
        if (response.data.success) {
          setSummaries(response.data.summaries || []);
        } else {
          throw new Error("Invalid response");
        }
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load summaries");
      } finally {
        setLoading(false);
      }
    };

    fetchSummaries();
  }, [isAuthenticated, navigate]);

  const stats = useMemo(() => {
    if (!summaries.length) {
      return { total: 0, average: 0, best: 0 };
    }
    const scores = summaries.map((item) => Number(item.score) || 0);
    const total = summaries.length;
    const average = scores.reduce((sum, val) => sum + val, 0) / total;
    const best = Math.max(...scores);
    return {
      total,
      average: Number(average.toFixed(1)),
      best: Number(best.toFixed(1)),
    };
  }, [summaries]);

  return (
    <section className="relative min-h-screen mt-20 overflow-hidden">
      <div className="absolute -top-32 -right-16 h-80 w-80 rounded-full bg-gradient-to-br from-[#38BDF8]/30 to-[#14F195]/20 blur-3xl"></div>
      <div className="absolute top-40 -left-24 h-96 w-96 rounded-full bg-gradient-to-tr from-[#F97316]/20 to-[#38BDF8]/10 blur-3xl"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_45%)]"></div>

      <div className="relative container mx-auto px-4 max-w-6xl py-14">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-blue-200/70">
              Interview Timeline
            </p>
            <h1 className="mt-3 text-3xl md:text-4xl font-bold text-white">
              Welcome back{userName ? `, ${userName}` : ""}.
            </h1>
            <p className="mt-3 text-gray-300 max-w-2xl">
              Every interview you complete becomes a lasting record. Track your
              progress, review feedback, and spot trends across sessions.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/upload")}
              className="px-6 py-3 rounded-xl bg-[#38BDF8] text-white font-semibold shadow-lg shadow-[#38BDF8]/30 hover:bg-blue-500 transition"
            >
              Start New Interview
            </button>
            {summaries[0] ? (
              <button
                onClick={() => navigate(`/summary/${summaries[0].interviewId}`)}
                className="px-6 py-3 rounded-xl border border-white/10 text-white/90 hover:text-white hover:border-white/30 transition"
              >
                View Latest Summary
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card rounded-2xl p-5">
            <p className="text-sm text-blue-200/80">Total Interviews</p>
            <p className="mt-2 text-3xl font-semibold text-white">{stats.total}</p>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <p className="text-sm text-blue-200/80">Average Score</p>
            <p className="mt-2 text-3xl font-semibold text-white">{stats.average}</p>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <p className="text-sm text-blue-200/80">Best Score</p>
            <p className="mt-2 text-3xl font-semibold text-white">{stats.best}</p>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">
              Interview Summaries
            </h2>
          </div>

          {loading ? (
            <div className="glass-card rounded-2xl p-10 text-center text-gray-300">
              Loading your interview timeline...
            </div>
          ) : error ? (
            <div className="bg-red-900/40 border border-red-400/40 rounded-2xl p-8 text-center text-red-200">
              {error}
            </div>
          ) : summaries.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center text-gray-300">
              <p className="text-lg text-white mb-3">No interviews yet.</p>
              <p className="mb-6">
                Start a session to generate your first summary card.
              </p>
              <button
                onClick={() => navigate("/upload")}
                className="px-6 py-3 rounded-xl bg-[#38BDF8] text-white font-semibold shadow-lg shadow-[#38BDF8]/30 hover:bg-blue-500 transition"
              >
                Start Your First Interview
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {summaries.map((summary) => (
                <button
                  key={summary.interviewId}
                  onClick={() => navigate(`/summary/${summary.interviewId}`)}
                  className="group text-left bg-gradient-to-br from-white/8 to-white/3 border border-white/10 rounded-2xl p-6 hover:border-[#38BDF8]/60 transition shadow-xl shadow-black/10"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-blue-200/70">
                        {summary.roleDomain || "Interview Summary"}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-white">
                        {summary.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-400">
                        {summary.createdAt
                          ? new Date(summary.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "Date unavailable"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="rounded-full bg-[#38BDF8]/15 px-3 py-1 text-sm font-semibold text-[#38BDF8]">
                        {summary.rating || "Rating"}
                      </div>
                      <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold">
                        {summary.score ?? 0}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-gray-300">
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-[10px] uppercase text-blue-200/60">Behavioral</p>
                      <p className="mt-1 text-base text-white">
                        {summary.sectionScores?.behavioral ?? 0}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-[10px] uppercase text-blue-200/60">Technical</p>
                      <p className="mt-1 text-base text-white">
                        {summary.sectionScores?.technical ?? 0}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-[10px] uppercase text-blue-200/60">Communication</p>
                      <p className="mt-1 text-base text-white">
                        {summary.sectionScores?.communication ?? 0}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
