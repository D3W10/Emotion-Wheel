"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/Button";
import { CircleQuestion } from "@/components/Icons";
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
        id: "middle",
        data: middleData
    },
    {
        innerRadius: 190,
        outerRadius: 270,
        cornerRadius: 3,
        id: "outer",
        data: outerData
    }
];

export default function Home() {
    const [homeScreen, setHomeScreen] = useState(true);
    const [itemData, setItemData] = useState();

    return (
        <main className="min-h-screen">
            {homeScreen && (
                <div className="h-full p-24 flex flex-col justify-center items-center absolute inset-0 bg-white/75 backdrop-blur space-y-40 z-10">
                    <div className="flex flex-col justify-center items-center space-y-10">
                        <Image src="/logo.svg" alt="Logo" width={72} height={72} />
                        <h1 className="text-7xl font-bold">Emotion Wheel</h1>
                    </div>
                    <div className="flex flex-col justify-center items-center space-y-10">
                        <Button onClick={() => setHomeScreen(false)}>Start</Button>
                        <Button className="flex space-x-2">
                            <CircleQuestion className="w-6 h-6" />
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
            </div>
        </main>
    )
}