import React from "react";

function Register() {
  return (
    <div className="bg-white min-h-screen w-full">
      <div className="text-center mt-[20px] font-bold text-[44px]
      font-mono">
        USER REGISTRATION
      </div>
      <div className="w-148 bg-black text-white font-bold mt-5
      ml-81 p-10 rounded-[30px] font-mono text-2xl">
        <div className="">Name</div>
        <input type = 'text' placeholder="Enter your name...."
        className="p-2 text-[15px] rounded-[20px] text-black bg-white mt-3 w-120" />
        <div className="mt-3">Email</div>
        <input type = 'text' placeholder="Enter your email...."
        className="p-2 text-[15px] rounded-[20px] text-black bg-white mt-3 w-120" />
        <div className="mt-3">Password</div>
        <input type = 'password' placeholder="Enter a password...."
        className="p-2 text-[15px] rounded-[20px] text-black bg-white mt-3 w-120" />
        <br />
        <button className="font-medium text-xl font-mono font-bold 
        rounded-[20px] text-black bg-[#D9D9D9] p-2 w-50 mt-5 ml-35
        cursor-pointer" type = "button">
          REGISTER
        </button>
      </div>
    </div>
  );
}

export default Register;