"use client";

import React, { useState, useRef } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function UploadPage() {
  // Form State Management
  const { user, loading, accessToken } = useAuth();
  const router = useRouter();

  const [songTitle, setSongTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGenre, setSelectedGenre] = useState("");
  const [price, setPrice] = useState('');
  const [sellMusic, setSellMusic] = useState(false);
  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/Login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <h1>Loading....</h1>
  }

  if (!user) {
    return null;
  }

  const genres = ['Classical', 'Folk', 'Pop', 'Instrumental', 'Fusion'];

  const genreWithId = {
    'Classical': 1,
    'Pop': 2,
    'Folk': 3,
    'Instrumental': 4,
    'Fusion': 5
  };

  // Handle file drag interactions
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Form Submission Handler
  const handleSubmit = async (e) => {
    setUploading(true);

    try {
      e.preventDefault();

      if (!file) {
        alert("Please choose a file");
        return;
      }

      const uploadData = new FormData();

      uploadData.append("file", file);
      uploadData.append("upload_preset", "bharatsings_audio");

      const allowed = [
        "audio/mpeg",
        "audio/wav",
        "audio/x-wav"
      ];

      if (!allowed.includes(file.type)) {
        alert("Only MP3 and WAV allowed.");
        return;
      }

      if (file.size > 100 * 1024 * 1024) {
        alert("Maximum size is 100MB");
        return;
      }

      if (!songTitle.trim()) {
        alert("Please enter a song title.");
        return;
      }

      if (!selectedGenre) {
        alert("Please select a genre.");
        return;
      }

      if (sellMusic && !price) {
        alert("Please enter a price.");
        return;
      }

      const res = await fetch("https://api.cloudinary.com/v1_1/otg38vo5/video/upload", {
        method: "POST",
        body: uploadData,
      });

      if (!res.ok) {
        const error = await res.json();
        console.log(error);
        alert(error.error?.message || "Cloudinary Upload Failed!");
        return;
      }

      const data = await res.json();

      console.log(data);
      console.log(data.secure_url);

      const res1 = await fetch(
        "http://localhost:5000/api/v1/audiofiles/createAudioFile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            url: data.secure_url,
          })
        }
      );

      if (!res1.ok) {
        alert("Audio File Creation Failed!");
        return;
      }

      const audioData = await res1.json();

      const audioId = audioData.data.createdAudioFile.id;

      console.log("Audio ID: ", audioId);

      const res2 = await fetch(
        "http://localhost:5000/api/v1/songs/createSong",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            title: songTitle,
            description: description,
            genreId: genreWithId[selectedGenre],
            audioFileId: audioId,
            forSale: sellMusic,
            price: price ? Number(price) : 0
          })
        }
      );

      if (!res2.ok) {
        const error = await res2.json();

        console.log(error);
        alert(error.message || "Song Creation Failed!");

        return;
      }

      const songData = await res2.json();

      console.log("Song created with the ID ", songData.data.createdSong.id);

      if (audioData.data.createdAudioFile.id && songData.data.createdSong.id && data.secure_url) {
        alert("Song Successfully Uploaded!");

        setSongTitle("");
        setDescription("");
        setSelectedGenre("");
        setPrice("");
        setSellMusic(false);
        setFile(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        return;
      } else {
        alert("Trouble Uploading Song!")
        return;
      }
    } catch (err) {
      console.log(err);
      alert(err.message || "Upload failed. Check the browser console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
        {/* Header Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-6">
          Upload Your Singing Masterpiece to the World
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Drag & Drop File Zone */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition cursor-pointer relative ${
              isDragActive 
                ? 'border-purple-600 bg-purple-50' 
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              id="music-file"
              className="hidden"
              accept=".mp3,.wav"
              onChange={handleFileChange}
            />
            <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
              {/* Cloud Upload Icon */}
              <svg
                className={`w-12 h-12 transition-colors ${isDragActive ? 'text-purple-600' : 'text-gray-400'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://w3.org"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="text-sm sm:text-base font-semibold text-gray-700">
                {file ? `Selected: ${file.name}` : 'Drag & Drop Your Song/Music File Here (MP3, WAV, etc.)'}
              </p>
              <button
                type="button"
                className="px-5 py-1.5 bg-gray-200 text-gray-700 text-xs sm:text-sm font-medium rounded-md hover:bg-gray-300 transition shadow-sm"
              >
                Browse Files
              </button>
            </div>
          </div>

          {/* Song Title Input */}
          <div className="space-y-2">
            <label htmlFor="song-title" className="block text-sm font-semibold text-gray-800">
              Song Title
            </label>
            <input
              type="text"
              id="song-title"
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
              placeholder="Enter your song's name"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-800">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition resize-none"
            ></textarea>
          </div>

          {/* Genre Checkboxes */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-800">
              Genre
            </label>

            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {genres.map((genre) => (
                <label
                  key={genre}
                  className="inline-flex items-center space-x-2 text-sm text-gray-700 cursor-pointer select-none"
                >
                  <input
                    type="radio"
                    name="genre"
                    value={genre}
                    checked={selectedGenre === genre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-4 h-4 text-purple-600 accent-purple-600"
                  />
                  <span>{genre}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Pricing Section */}
          <div className="space-y-2">
            <label htmlFor="pricing" className="block text-sm font-semibold text-gray-800">
              Pricing For Hirers (Optional)
            </label>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Rs</span>
              <input
                type="number"
                id="pricing"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Sell Music Toggle */}
          <div className="flex items-center justify-between sm:justify-start sm:space-x-4">
            <span className="text-sm font-semibold text-gray-800">Sell Music & Copyrights (Optional)</span>
            <button
              type="button"
              onClick={() => setSellMusic(!sellMusic)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 ${
                sellMusic ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  sellMusic ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Upload Button */}
          <div className="pt-4">
            <button
              disabled = {uploading}
              type="submit"
              className="w-full py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition shadow-md text-base tracking-wide focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
            >
              {uploading ? "Uploading...." : "Upload"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default UploadPage;