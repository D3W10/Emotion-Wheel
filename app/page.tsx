import Image from "next/image";
import Button from "@/components/Button";
import { CircleQuestion } from "@/components/Icons";

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col justify-center items-center p-24">
            <div className="space-y-40">
                <div className="flex flex-col justify-center items-center space-y-10">
                    <Image src="/logo.svg" alt="Logo" width={72} height={72} />
                    <h1 className="text-7xl font-bold">Emotion Wheel</h1>
                </div>
                <div className="flex flex-col justify-center items-center space-y-10">
                    <Button>Start</Button>
                    <Button className="flex space-x-2">
                        <CircleQuestion className="w-6 h-6" />
                        <span>How it works</span>
                    </Button>
                </div>
            </div>
        </main>
    );
}