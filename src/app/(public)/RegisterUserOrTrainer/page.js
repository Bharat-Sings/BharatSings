"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function RegisterUserOrTrainer() {
    const router = useRouter();

    return (
        <div className="flex gap-10">
            <button className=""
            onClick={() => {
                router.push("/Register");
            }}>
                REGISTER AS USER
            </button>
            <button className=""
            onClick = {() => {
                router.push("/RegisterTrainer");
            }}>
                REGISTER AS TRAINER
            </button>
        </div>
    )
}