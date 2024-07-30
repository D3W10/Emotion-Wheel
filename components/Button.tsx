"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { twMerge } from "tailwind-merge";

export default function Button(props: HTMLMotionProps<"button"> & { secondary?: boolean }) {
    const { className, secondary, ...rest } = props;

    return (<motion.button className={twMerge(`min-w-36 p-1.5 ${!props.disabled ? "active:p-1" : ""} flex justify-center items-center relative text-xl ${secondary ? "hover:bg-zinc-500/20" : ""} disabled:bg-zinc-300 rounded-full overflow-hidden group transition-[background-color,padding] duration-200 ${!props.disabled && !secondary ? "before:w-full before:block before:absolute before:bg-warmth before:aspect-square before:animate-[warmthRotate_10s_linear_infinite] before:-z-10" : ""}`, className)} whileTap={{ scale: !props.disabled ? 0.9 : 1 }} {...rest}>
        <motion.div className={`w-full h-full px-5 py-1 ${!props.disabled ? "group-active:px-5.5 group-active:py-1.5" : ""} flex justify-center items-center rounded-full space-x-2 ${!secondary ? "bg-zinc-100/75 backdrop-blur" : ""} transition-[padding] duration-200`}>
            {props.children}
        </motion.div>
    </motion.button>);
}