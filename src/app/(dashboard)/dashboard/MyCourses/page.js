"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import axios from "axios";

export default function MyCourses() {
    const [enrollments, setEnrollments] = useState([]);

    const { user, accessToken, loading } = useAuth();
    const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URI;
    const router = useRouter();

    useEffect(() => {
        if (!user && !loading) {
            router.replace("/Login");
        }
    }, [user, loading, router]);

    //Courses are in enrollment.course
    const getMyEnrollments = async () => {
        try {
            const response = await axios.get(
                `${API_BASE}/api/v1/enrollments/findEnrollmentsByUserId`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );

            setEnrollments(response.data.data.enrollments);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (!loading && user) {
            getMyEnrollments();
        }
    }, [user, loading, enrollments]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0B0B10]">
                <h1 className="text-lg font-semibold text-gray-400">Loading....</h1>
            </div>
        );
    }

    return (
        <div className = ""></div>
    )
}