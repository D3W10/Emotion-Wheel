"use client";

import { motion } from "framer-motion";
import type { HTMLAttributes } from "react";

export default function Button(props: HTMLAttributes<HTMLButtonElement>) {
    return (<motion.button className="px-12 py-2.5 text-xl bg-blue-500 rounded-full animate-[hueRotate_15s_linear_infinite]" whileTap={{ scale: 0.85 }}>{props.children}</motion.button>);
}