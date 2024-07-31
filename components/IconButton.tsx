import { twMerge } from "tailwind-merge";
import type { HTMLAttributes } from "react";

export default function Button(props: HTMLAttributes<HTMLButtonElement>) {
    const { className, ...rest } = props;

    return (<button className={twMerge("p-2 before:block before:absolute before:inset-0 before:bg-zinc-200 before:rounded-lg before:aspect-square before:scale-0 before:-z-10 before:transition-transform before:duration-500 before:ease-out hover:before:scale-100", className)} {...rest}>{props.children}</button>);
}