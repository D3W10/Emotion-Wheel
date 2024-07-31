"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/Button";
import Icons from "@/components/Icons";
import IconButton from "@/components/IconButton";
import { motion, useSpring } from "framer-motion";
import { pieArcLabelClasses, PieChart } from "@mui/x-charts/PieChart";
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

enum Stages {
    Intro,
    First,
    Second,
    Third,
    Final
}

const pieScale: { [key in Stages]: number } = {
    [Stages.Intro]: 1.6,
    [Stages.First]: 3,
    [Stages.Second]: 1,
    [Stages.Third]: 1,
    [Stages.Final]: 1.6
}

export default function Home() {
    const [stage, setStage] = useState<Stages>(Stages.Intro);
    const [isAnimated, setAnimated] = useState(true);
    const [itemData, setItemData] = useState();

    const springConfig = { damping: 50, stiffness: 100 };
    const rotateSpring = useSpring(0, springConfig);
    const scaleSpring = useSpring(0, springConfig);

    useEffect(() => {
        scaleSpring.set(pieScale[stage])

        if (stage === Stages.Intro)
            setAnimated(true);
    }, [stage]);

    function onStart() {
        setAnimated(false);
        setStage(Stages.First);
        rotateSpring.set(360 - rotateSpring.get() + 360);
    }

    function onReset() {
        setStage(Stages.Intro);
    }

    return (
        <main className="min-h-screen">
            {stage === Stages.Intro && (
                <div className={`h-full p-24 flex flex-col justify-center items-center absolute inset-0 bg-white/75 backdrop-blur space-y-40 transition duration-500 z-10 ${isAnimated ? "ease-out opacity-100 scale-100" : "ease-in opacity-0 scale-125"}`} onTransitionEnd={e => e.propertyName == "opacity" && !isAnimated && setStage(Stages.Intro)}>
                    <div className="flex flex-col justify-center items-center space-y-10">
                        <Image src="/logo.svg" alt="Logo" width={72} height={72} />
                        <h1 className="text-7xl font-bold">Emotion Wheel</h1>
                    </div>
                    <div className="flex flex-col justify-center items-center space-y-10">
                        <Button onClick={onStart}>Start</Button>
                        <Button secondary>
                            <Icons.CircleQuestion className="w-6 h-6" />
                            <span>How it works</span>
                        </Button>
                    </div>
                </div>
            )}
            <div className="h-full flex justify-center items-center absolute inset-0">
                <motion.div className="h-full aspect-square" style={{ rotate: rotateSpring, scale: scaleSpring }}>
                    <PieChart
                        series={series}
                        tooltip={{ trigger: "none" }}
                        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                        slotProps={{ legend: { hidden: true } }}
                        onItemClick={(_, d) => { console.log(d);setItemData(d)}}
                        sx={{
                            [`& .${pieArcLabelClasses.root}`]: {
                                fontSize: "0.7rem",
                                fill: "white",
                                filter: "drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))"
                            },
                        }}
                    />
                </motion.div>
                <IconButton className="absolute bottom-6 left-6" onClick={onReset}>
                    <Icons.Home className="w-8 h-8" />
                </IconButton>
            </div>
        </main>
    )
}