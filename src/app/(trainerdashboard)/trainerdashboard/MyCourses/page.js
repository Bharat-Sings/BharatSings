"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTrainerAuth } from "@/app/context/TrainerAuthContext";
import { useRouter } from "next/navigation";

export default function MyCourses() {
    let [courses, setCourses] = useState([]);

    const { trainer, accessToken, loading } = useTrainerAuth();

    const router = useRouter();

    useEffect(() => {
        if (!trainer && !loading) {
            router.replace("/loginTrainer");
        }
    }, [trainer, loading, router]);

    const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URI;

    const findMyCourses = async () => {
        try {
            const response = await axios.get(
                `${API_BASE}/api/v1/courses/findCoursesByTrainerId`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                }
            );

            setCourses(response.data.data.courses);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (!loading && trainer) {
            findMyCourses();
        }
    }, [loading, trainer]);


    if (loading) {
        return (
        <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7]">
            <h1 className="text-lg font-semibold text-gray-500">Loading....</h1>
        </div>
        );
    }

    return (
        <div className = "">
            {
                courses.map((course) => (
                    <div className="" key = {course.id}>
                        <div className="">{course.title}</div>
                        <div className="">{course.description}</div>
                        <div className="">{course.category}</div>
                    </div>
                ))
            }
        </div>
    )
}