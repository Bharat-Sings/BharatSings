"use client";

import React from "react";
// Added custom interface icons to fit the new fields perfectly
import { UserPlus, Mail, Lock, Smile, Calendar, Users, Globe, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

function Register() {
  // Individual field states matching the requested parameters
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");
  const [dateOfBirth, setDateOfBirth] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [bio, setBio] = React.useState("");

  const router = useRouter();
  const { login } = useAuth();

  const API_BASE = process.env.BACKEND_URI;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BACKEND_URI}/api/v1/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          display_name: displayName,
          date_of_birth: dateOfBirth,
          gender,
          country,
          bio,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      login(data.user, data.accessToken);

      router.push("/dashboard");
      //alert("Registration Successful");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA] p-4 my-8">
      {/* --- CARD CONTAINER --- */}
      <div className="w-full max-w-md rounded-[24px] bg-[#13131A] p-8 shadow-2xl text-center">
        
        {/* --- TOP AVATAR / ICON HEADER --- */}
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#1C1A2E] border border-[#3A2570]">
          <UserPlus className="h-6 w-6 text-[#7F56D9]" />
        </div>

        {/* --- HEADER TEXT --- */}
        <h2 className="text-2xl font-semibold text-white tracking-wide">
          Create Your Account
        </h2>
        <p className="mt-1 text-xs text-gray-400">
          Join Bharat Sings and start your musical journey
        </p>

        {/* --- REGISTRATION FORM --- */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          
          {/* 1. DISPLAY NAME INPUT */}
          <div className="relative rounded-xl bg-[#1C1C24] border border-gray-800 focus-within:border-[#7F56D9] transition-all p-3 text-left">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <Smile size={18} />
            </span>
            <div className="pl-8 flex flex-col">
              <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                className="w-full bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none mt-0.5"
                required
              />
            </div>
          </div>

          {/* 2. EMAIL INPUT */}
          <div className="relative rounded-xl bg-[#1C1C24] border border-gray-800 focus-within:border-[#7F56D9] transition-all p-3 text-left">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <Mail size={18} />
            </span>
            <div className="pl-8 flex flex-col">
              <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none mt-0.5"
                required
              />
            </div>
          </div>

          {/* 3. PASSWORD INPUT */}
          <div className="relative rounded-xl bg-[#1C1C24] border border-gray-800 focus-within:border-[#7F56D9] transition-all p-3 text-left">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <Lock size={18} />
            </span>
            <div className="pl-8 flex flex-col">
              <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none mt-0.5"
                required
              />
            </div>
          </div>

          {/* 4. DATE OF BIRTH INPUT */}
          <div className="relative rounded-xl bg-[#1C1C24] border border-gray-800 focus-within:border-[#7F56D9] transition-all p-3 text-left">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <Calendar size={18} />
            </span>
            <div className="pl-8 flex flex-col">
              <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                Date of Birth
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full bg-transparent text-sm text-white focus:outline-none mt-0.5 [color-scheme:dark]"
                required
              />
            </div>
          </div>

          {/* 5. GENDER SELECT DROP-DOWN */}
          <div className="relative rounded-xl bg-[#1C1C24] border border-gray-800 focus-within:border-[#7F56D9] transition-all p-3 text-left">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <Users size={18} />
            </span>
            <div className="pl-8 flex flex-col">
              <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-transparent text-sm text-white focus:outline-none mt-0.5 cursor-pointer appearance-none"
                required
              >
                <option value="" disabled className="bg-[#1C1C24]">Select gender</option>
                <option value="male" className="bg-[#1C1C24]">Male</option>
                <option value="female" className="bg-[#1C1C24]">Female</option>
                <option value="other" className="bg-[#1C1C24]">Other</option>
                <option value="prefer_not_to_say" className="bg-[#1C1C24]">Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* 6. COUNTRY INPUT */}
          <div className="relative rounded-xl bg-[#1C1C24] border border-gray-800 focus-within:border-[#7F56D9] transition-all p-3 text-left">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <Globe size={18} />
            </span>
            <div className="pl-8 flex flex-col">
              <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. India"
                className="w-full bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none mt-0.5"
                required
              />
            </div>
          </div>

          {/* 7. BIO TEXTAREA INPUT */}
          <div className="relative rounded-xl bg-[#1C1C24] border border-gray-800 focus-within:border-[#7F56D9] transition-all p-3 text-left">
            <span className="absolute left-4 top-6 text-gray-500">
              <FileText size={18} />
            </span>
            <div className="pl-8 flex flex-col">
              <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about your musical journey..."
                rows={3}
                className="w-full bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none mt-1 resize-none min-h-[60px]"
                maxLength={250}
              />
            </div>
          </div>

          {/* --- SUBMIT BUTTON --- */}
          <button
            type="submit"
            className="w-full rounded-xl bg-[#6366F1] py-3.5 text-sm font-semibold tracking-wide text-white uppercase transition-all duration-200 hover:bg-[#5356E2] active:scale-[0.99] focus:outline-none mt-6 shadow-lg shadow-indigo-600/20"
          >
            Register
          </button>
        </form>

        {/* --- FOOTER REDIRECT --- */}
        <p className="mt-8 text-xs text-gray-500">
          Already have an account?{" "}
          <a href="/Login" className="text-[#6366F1] hover:underline font-medium ml-1">
            Login
          </a>
        </p>

      </div>
    </div>
  );
}

export default Register;
