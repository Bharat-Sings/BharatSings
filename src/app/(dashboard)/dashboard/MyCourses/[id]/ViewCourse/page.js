"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import axios from "axios";

export default function ViewCourse() {
    const [videos, setVideos] = useState([]);

    const { user, loading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const courseId = params?.id;

    const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URI;

    useEffect(() => {
        if (!user && !loading) {
            router.replace("/Login");
        }
    }, [user, loading, router]);

    const getVideos = async () => {
        try {
            const response = await axios.get(
                `${API_BASE}/api/v1/videos/findVideosByCourseId`,
                {
                    params: {
                        course_id: courseId
                    }
                }
            );

            setVideos(response.data.data.videos);
        } catch (err) {
            console.log(err);
        }
    }

    if (loading) {
        return (
        <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7]">
            <h1 className="text-lg font-semibold text-gray-500">Loading....</h1>
        </div>
        );
    }

    return (
        <div className="">
            {videos.map((video) => (
                <div className = "">
                    <video src = {video.file_path} width={400} height={300} className="" /> 
                </div>
            ))}
        </div>
    )
}