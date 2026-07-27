"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function LoginUserOrTrainer() {
    const router = useRouter();

    return (
        <div className="flex gap-10">
            <button className=""
            onClick={() => {
                router.push("/Login");
            }}>
                LOGIN AS USER
            </button>
            <button className=""
            onClick = {() => {
                router.push("/LoginTrainer");
            }}>
                LOGIN AS TRAINER
            </button>
        </div>
    )
}