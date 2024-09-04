"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useInterval } from "@/components/useInterval";
import Button from "@/components/Button";
import Icons from "@/components/Icons";
import IconButton from "@/components/IconButton";
import { motion, useSpring } from "framer-motion";
import { pieArcLabelClasses, PieChart } from "@mui/x-charts/PieChart";
import { innerData, middleData, outerData } from "@/public/data";
import type { MakeOptional } from "@mui/x-charts/internals";
import type { PieItemIdentifier, PieSeriesType, PieValueType } from "@mui/x-charts/models/seriesType";

enum Stages {
    Intro,
    First,
    Second,
    Third,
    Final
}

const pieScale: { [key in Stages]: number } = {
    [Stages.Intro]: 1.6,
    [Stages.First]: 2.8,
    [Stages.Second]: 1,
    [Stages.Third]: 1,
    [Stages.Final]: 1.6
}

export default function Home() {
    const [stage, setStage] = useState<Stages>(Stages.Intro);
    const [showHomeScreen, setHomeScreen] = useState(true);
    const [showHelp, setHelp] = useState(false);
    const [isAnimated, setAnimated] = useState(true);
    const [itemData, setItemData] = useState<PieItemIdentifier>();

    let rotateVal = useRef(0);
    const springConfig = { damping: 50, stiffness: 100 };
    const rotateSpring = useSpring(rotateVal.current, springConfig);
    const scaleSpring = useSpring(0, springConfig);
    const setRotateVal = (v: number) => { rotateVal.current = v; rotateSpring.set(v) };

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

    useEffect(() => {
        scaleSpring.set(pieScale[stage])

        if (stage === Stages.Intro) {
            setHomeScreen(true);
            setTimeout(() => setAnimated(true), 50);
        }
    }, [stage]);

    useInterval(() => setRotateVal(rotateVal.current + 1), stage === Stages.Intro ? 100 : null);

    function onStart() {
        setAnimated(false);
        setStage(Stages.First);
        
        setTimeout(() => setRotateVal(Math.ceil(rotateVal.current / 360) * 360), 100);
    }

    function onReset() {
        setStage(Stages.Intro);
    }

    return (
        <main className="min-h-screen">
            {showHomeScreen && (
                <div className={`h-full p-24 absolute inset-0 bg-white/75 backdrop-blur transition duration-500 z-30 ${isAnimated ? "ease-out opacity-100 scale-100" : "ease-in opacity-0 scale-125"}`} onTransitionEnd={e => e.propertyName == "opacity" && !isAnimated && setHomeScreen(false)}>
                    {!showHelp ? (
                        <div className="flex flex-col justify-center items-center absolute inset-0 space-y-40">
                            <div className="flex flex-col justify-center items-center space-y-10">
                                <Image src="/logo.svg" alt="Logo" width={72} height={72} />
                                <h1 className="text-7xl font-bold">Emotion Wheel</h1>
                            </div>
                            <div className="flex flex-col justify-center items-center space-y-10">
                                <Button onClick={onStart}>Start</Button>
                                <Button secondary onClick={() => setHelp(true)}>
                                    <Icons.CircleQuestion className="w-6 h-6" />
                                    <span>How it works</span>
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center absolute inset-0 space-y-40">
                            <h2 className="text-6xl font-bold">How it works</h2>
                            <Button secondary onClick={() => setHelp(false)}>
                                <Icons.ArrowLeft className="w-6 h-6" />
                                <span>Go back</span>
                            </Button>
                        </div>
                    )}
                </div>
            )}
            <div className="h-full flex justify-center items-center absolute inset-0">
                <p className={`absolute top-20 text-3xl ${[Stages.First, Stages.Second, Stages.Third].includes(stage) ? "opacity-100 delay-1000" : "opacity-0"} duration-[2.5s] z-10`}>Choose the emotion that better describes you</p>
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
                            [`& g`]: {
                                transition: "opacity 0.5s"
                            },
                            [`& g:nth-of-type(4)`]: {
                                opacity: stage !== Stages.Intro ? "1" : "0",
                                pointerEvents: stage !== Stages.Intro ? "auto" : "none"
                            },
                            [`& g:nth-of-type(2), & g:nth-of-type(5)`]: {
                                opacity: stage !== Stages.First ? "1" : "0",
                                pointerEvents: stage !== Stages.First ? "auto" : "none"
                            },
                            [`& g:nth-of-type(3), & g:nth-of-type(6)`]: {
                                opacity: stage !== Stages.First && stage !== Stages.Second ? "1" : "0",
                                pointerEvents: stage !== Stages.First && stage !== Stages.Second ? "auto" : "none"
                            }
                        }}
                    />
                </motion.div>
                <IconButton className="fixed bottom-6 left-6" onClick={onReset}>
                    <Icons.Home className="w-8 h-8" />
                </IconButton>
            </div>
        </main>
    )
}