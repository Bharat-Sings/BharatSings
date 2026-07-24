"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";

function Dashboard() {

    const { user, loading, logout: authLogout } = useAuth();
    const router = useRouter();


    useEffect(() => {

        if (!loading && !user) {
            router.push("/Login");
        }

    }, [user, loading, router]);


    if (loading) {
        return <h1>Loading....</h1>;
    }


    if (!user) {
        return null;
    }


    const logout = async () => {

        try {

            await axios.post(
                "http://localhost:5000/api/v1/users/logout",
                {},
                {
                    withCredentials: true
                }
            );


            // Remove user and access token
            // from localStorage + AuthContext
            authLogout();


            // Redirect to login page
            router.push("/Login");


        } catch (error) {

            console.log("Logout Error:", error);

        }

    };


    return (

        <div>

            <div className="font-bold text-3xl">
                Hi, {user.display_name}!
            </div>


            <button
                className="
                mt-10 
                bg-purple-700 
                rounded-[20px] 
                p-2 
                font-bold 
                text-white 
                w-50
                cursor-pointer 
                hover:border-2 
                hover:border-purple-700 
                hover:text-purple-700 
                hover:bg-white
                "
                onClick={() => {
                    router.push("/dashboard/SongUpload");
                }}
            >
                UPLOAD SONG
            </button>


            <br />


            <button
                className="
                mt-10 
                bg-purple-700 
                rounded-[20px] 
                p-2 
                font-bold 
                text-white 
                w-50
                cursor-pointer 
                hover:border-2 
                hover:border-purple-700 
                hover:text-purple-700 
                hover:bg-white
                "
                onClick={logout}
            >
                LOGOUT
            </button>


        </div>

    );
}


export default Dashboard;