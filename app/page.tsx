"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/Button";
import Icons from "@/components/Icons";
import IconButton from "@/components/IconButton";
import { PieChart } from "@mui/x-charts/PieChart";
import { innerData, middleData, outerData } from "@/public/data";
import type { MakeOptional } from "@mui/x-charts/internals";
import type { PieSeriesType, PieValueType } from "@mui/x-charts/models/seriesType";

const series: MakeOptional<PieSeriesType<MakeOptional<PieValueType, "id">>, "type">[] = [
    {
        innerRadius: 30,
        outerRadius: 110,
        cornerRadius: 3,
        startAngle: -30,
        arcLabel: "label",
        id: "inner",
        data: innerData
    },
    {
        innerRadius: 110,
        outerRadius: 190,
        cornerRadius: 3,
        startAngle: -30,
        id: "middle",
        data: middleData
    },
    {
        innerRadius: 190,
        outerRadius: 270,
        cornerRadius: 3,
        startAngle: -30,
        id: "outer",
        data: outerData
    }
];

export default function Home() {
    const [isHomeScreen, setHomeScreen] = useState(true);
    const [isAnimated, setAnimated] = useState(true);
    const [itemData, setItemData] = useState();

    useEffect(() => {
        if (isHomeScreen)
            setAnimated(true);
    }, [isHomeScreen]);

    return (
        <main className="min-h-screen">
            {isHomeScreen && (
                <div className={`h-full p-24 flex flex-col justify-center items-center absolute inset-0 bg-white/75 backdrop-blur space-y-40 transition duration-500 z-10 ${isAnimated ? "ease-out opacity-100 scale-100" : "ease-in opacity-0 scale-125"}`} onTransitionEnd={e => e.propertyName == "opacity" && !isAnimated && setHomeScreen(false)}>
                    <div className="flex flex-col justify-center items-center space-y-10">
                        <Image src="/logo.svg" alt="Logo" width={72} height={72} />
                        <h1 className="text-7xl font-bold">Emotion Wheel</h1>
                    </div>
                    <div className="flex flex-col justify-center items-center space-y-10">
                        <Button onClick={() => setAnimated(false)}>Start</Button>
                        <Button secondary>
                            <Icons.CircleQuestion className="w-6 h-6" />
                            <span>How it works</span>
                        </Button>
                    </div>
                </div>
            )}
            <div className="h-full flex justify-center items-center absolute inset-0">
                <div className="h-5/6 aspect-square">
                    <PieChart
                        series={series}
                        tooltip={{ trigger: "none" }}
                        slotProps={{ legend: { hidden: true } }}
                        onItemClick={(event, d) => setItemData(d)}
                    />
                </div>
                <IconButton className="absolute bottom-6 left-6" onClick={() => setHomeScreen(true)}>
                    <Icons.Home className="w-8 h-8" />
                </IconButton>
            </div>
        </main>
    )
}