import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setInterviewId, setIsResumeUploaded } from '../slices/generalInfo.slice';
import { useApi } from '../utils/api.js';
import { v4 as uuidv4 } from 'uuid';

const UploadBox = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfName, setPdfName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { userId, interviewId } = useSelector((state) => state.generalInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const api = useApi();

  useEffect(() => {
    const newInterviewId = uuidv4();
    localStorage.setItem('interviewId', newInterviewId);
    dispatch(setInterviewId(newInterviewId));
  }, [dispatch]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setPdfName(file.name);
    } else {
      setPdfFile(null);
      setPdfName("");
      toast.error("Please select a valid PDF file");
    }
  };

  const handleUpload = async () => {
    if (!pdfFile && !description.trim()) {
      toast.error("Please upload a PDF file or provide a description");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      if (pdfFile) {
        formData.append('resume', pdfFile);
      }

      if (description.trim()) {
        formData.append('description', description.trim());
      }

      formData.append('userId', userId);
      formData.append('interviewId', interviewId);

      const response = await api.post("/api/check", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success(response.data.message || "Resume uploaded successfully!");
        dispatch(setIsResumeUploaded(true));
        setPdfFile(null);
        setPdfName("");
        setDescription("");
        navigate('/interview')
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.error || "Failed to upload resume";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 flex flex-col h-full">
      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 h-full">
        <div className="w-full md:w-1/2">
          <div className="border border-white/10 rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center bg-white/5 hover:border-[#38BDF8]/60 transition">
            <div className="w-20 h-20 text-3xl bg-[#38BDF8]/10 rounded-2xl flex items-center justify-center mb-4">
              📄
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Upload Your Resume
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              PDF (Max 5MB)
            </p>
            <label
              htmlFor="resume-upload"
              className={`bg-[#38BDF8] hover:bg-blue-500 text-white font-medium rounded-full px-6 py-2 transition shadow-lg shadow-[#38BDF8]/30 ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              Choose File
            </label>
            <input
              id="resume-upload"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
              disabled={isLoading}
            />
            <p className="text-gray-400 text-sm mt-4">
              {pdfName || "No file selected"}
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <div className="h-full flex flex-col">
            <h3 className="text-xl font-semibold text-white mb-4">
              Or Describe Yourself
            </h3>
            <textarea
              className={`w-full h-full p-4 border border-white/10 rounded-2xl bg-white/5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] resize-none ${isLoading && "cursor-not-allowed"}`}
              placeholder="Describe your background, experience, or the job you're targeting…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            ></textarea>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleUpload}
          disabled={isLoading}
          className={`bg-[#38BDF8] hover:bg-blue-500 text-white font-semibold rounded-full px-8 py-4 transition flex items-center justify-center mx-auto shadow-lg shadow-[#38BDF8]/30 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {isLoading ? (
            <>
              <div className="rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            '✨ Generate Interview'
          )}
        </button>
      </div>
    </div>
  )
}

export default UploadBox
