"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animated, AnimationConfig, SpringConfig, useSpringValue } from "@react-spring/web";
import { useInterval } from "@/components/useInterval";
import Button from "@/components/Button";
import Icons from "@/components/Icons";
import IconButton from "@/components/IconButton";
import { PieArcLabelProps, PieChart } from "@mui/x-charts/PieChart";
import { innerData, middleData, outerData } from "@/public/data";
import { springConfig } from "@/public/utils";
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
    [Stages.Second]: 2.5,
    [Stages.Third]: 2.5,
    [Stages.Final]: 1.6
}

export default function Home() {
    const [stage, setStage] = useState<Stages>(Stages.Intro);
    const [showHomeScreen, setHomeScreen] = useState(true);
    const [showHelp, setHelp] = useState(false);
    const [isAnimated, setAnimated] = useState(true);
    const [fItemData, setFItemData] = useState<PieItemIdentifier>();
    const [sItemData, setSItemData] = useState<PieItemIdentifier>();
    const [tItemData, setTItemData] = useState<PieItemIdentifier>();
    const rotateVal = useRef(0);

    const rotateSpring = useSpringValue(rotateVal.current, springConfig);
    const scaleSpring = useSpringValue(0, springConfig);
    const xSpring = useSpringValue(0, springConfig);
    const ySpring = useSpringValue(0, springConfig);
    const setRotateVal = (v: number, config?: Partial<AnimationConfig> | ((key: string) => SpringConfig)) => { rotateVal.current = v; !config ? rotateSpring.start(v) : rotateSpring.start(v, { config }); };

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
            arcLabel: "label",
            id: "middle",
            data: middleData
        },
        {
            innerRadius: 190,
            outerRadius: 270,
            cornerRadius: 3,
            startAngle: -30,
            arcLabel: "label",
            id: "outer",
            data: outerData
        }
    ];

    let past: number = 0;
    const angles = [453.5294, 395.2941, 337.0589, 268.2353, 199.4118, 506.4706];
    const childRanges = series[0].data.map(d => Array.from({ length: d.value }, () => past++));

    useEffect(() => {
        scaleSpring.start(pieScale[stage]);

        if (stage === Stages.Intro) {
            setHomeScreen(true);
            setTimeout(() => setAnimated(true), 50);

            ySpring.start(0);

            setPieStyle(1, true);
            setPieStyle(2, true);
            setPieStyle(3, true);
        }
        else if (stage === Stages.First) {
            xSpring.start(0);
            ySpring.start(50);

            setPieStyle(1, true);
            setPieStyle(2, false);
            setPieStyle(3, false);
        }
        else if (stage === Stages.Second)
            xSpring.start(-200);
        else if (stage === Stages.Third)
            xSpring.start(-400);
        else
            xSpring.start(0);
    }, [stage]);

    useInterval(() => setRotateVal((rotateVal.current + 0.2) % 360, { friction: 0, tension: 0 }), stage === Stages.Intro ? 16 : null);

    function onStart() {
        setAnimated(false);
        setStage(Stages.First);

        setTimeout(() => setRotateVal(Math.ceil(rotateVal.current / 360) * 360, springConfig.config), 16);
    }

    function onReset() {
        setStage(Stages.Intro);
    }

    function onBack() {
        if (stage === Stages.Second && fItemData) {
            setStage(Stages.First);
            setRotateVal(rotateVal.current - angles[fItemData.dataIndex]);
        }
        else if (stage === Stages.Third && sItemData) {
            setStage(Stages.Second);
            setRotateVal(rotateVal.current + angles[sItemData.dataIndex]);
        }
    }

    function onItemClick(pie: PieItemIdentifier) {
        if (pie.seriesId === "inner") {
            setStage(Stages.Second);
            setFItemData(pie);

            setRotateVal(rotateVal.current + angles[pie.dataIndex]);
        }
        else if (pie.seriesId === "middle") {
            setStage(Stages.Third);
            setSItemData(pie);
        }
        else if (pie.seriesId === "outer") {
            setStage(Stages.Final);
            setTItemData(pie);
        }
    }

    function setPieStyle(series: 1 | 2 | 3, on = true) {
        document.querySelectorAll<SVGPathElement>(`#wheel svg > g > g:nth-of-type(${series}) path`).forEach(val => {
            val.style.opacity = on ? "1" : "0";
            val.style.pointerEvents = on ? "auto" : "none";
        });
    }

    function updatePieStyle(series: 1 | 2 | 3, indices: number[], { t, f } = { t: "1", f: "0" }) {
        document.querySelectorAll<SVGPathElement>(`#wheel svg > g > g:nth-of-type(${series}) path`).forEach((val, key) => {
            val.style.opacity = indices.includes(key) ? t : f;
            val.style.pointerEvents = indices.includes(key) ? "auto" : "none";
        });
    }

    const ArcLabel = (props: PieArcLabelProps) => {
        const textSz = props.id == "inner" ? "text-[0.7rem]" : props.id == "middle" ? "text-[0.6rem]" : "text-[0.5rem]";
        const idx = series.find(s => s.id == props.id)!.data.findIndex(d => d.label == props.formattedArcLabel);
        const offset = props.id == "inner" ? 0 : idx;

        const [[x, y], setCoords] = useState<[number, number]>([0, 0]);
        const [rotation, setRotation] = useState(0);
        const [opacity, setOpacity] = useState(0);

        useEffect(() => {
            const angle = (parseFloat(props.startAngle.animation.to.toString()) + parseFloat(props.endAngle.animation.to.toString())) / 2 - Math.PI / 2;
            const radius = (parseFloat(props.innerRadius.animation.to.toString()) + parseFloat(props.outerRadius.animation.to.toString())) / 2;

            setCoords([ radius * Math.cos(angle), radius * Math.sin(angle) ]);
        }, []);

        useEffect(() => {
            if (stage == Stages.First)
                setOpacity(props.id == "inner" ? 1 : 0);
            else if (stage == Stages.Second) {
                if (props.id == "inner") {
                    setOpacity(idx != fItemData!.dataIndex ? 0 : 1);
                    setRotation(-angles[fItemData!.dataIndex])
                }
                else if (props.id == "middle" && childRanges[fItemData!.dataIndex].includes(idx)) {
                    setOpacity(1);
                    updatePieStyle(1, [fItemData!.dataIndex], { t: "1", f: "0.25"});
                    updatePieStyle(2, childRanges[fItemData!.dataIndex]);
                }
            }
        }, [stage]);

        return (
            <text className={textSz + " fill-white drop-shadow-md pointer-events-none"} textAnchor="middle" style={{ opacity: opacity, transform: `translate3d(${x}px, calc(${y}px + 0.2rem), 0px)`, transformOrigin: `${x}px ${y}px`, rotate: rotation ? `${rotation}deg` : props.id == "inner" ? "0" : props.id == "middle" ? `calc(${offset} * 10.5882deg - 120deg + 5.2941deg)` : `calc(${offset} * 10.5882deg - 120deg + 2.64705deg)` }}>{props.formattedArcLabel}</text>
        );
    };

    return (
        <main className="min-h-screen">
            {showHomeScreen && (
                <div className={`h-full p-24 absolute inset-0 bg-white/75 backdrop-blur transition duration-500 z-30 ${isAnimated ? "ease-out opacity-100 scale-100" : "ease-in opacity-0 scale-125"}`} onTransitionEnd={e => e.propertyName == "opacity" && !isAnimated && setHomeScreen(false)}>
                    {!showHelp ? (
                        <animated.div className="flex flex-col justify-center items-center absolute inset-0 space-y-40">
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
                        </animated.div>
                    ) : (
                        <animated.div className="flex flex-col justify-center items-center absolute inset-0 space-y-40">
                            <h2 className="text-6xl font-bold">How it works</h2>
                            <div className="w-128 text-lg text-center space-y-5">
                                <p>You will be asked what you feel three times, showing more precise emotions as the questions progress.</p>
                                <p>Just select the emotion that better describes what you're feeling and an overview will be preseted to you in the end.</p>
                            </div>
                            <Button secondary onClick={() => setHelp(false)}>
                                <Icons.ArrowLeft className="w-6 h-6" />
                                <span>Go back</span>
                            </Button>
                        </animated.div>
                    )}
                </div>
            )}
            <div className="h-full flex justify-center items-center absolute inset-0">
                <p className={`absolute top-20 text-3xl ${[Stages.First, Stages.Second, Stages.Third].includes(stage) ? "opacity-100 delay-1000" : "opacity-0"} duration-[2.5s] z-10`}>Choose the emotion that better describes you</p>
                <animated.div id="wheel" className="h-full aspect-square" style={{ x: xSpring, y: ySpring, rotate: rotateSpring.to((t) => t), scale: scaleSpring }}>
                    <PieChart
                        series={series}
                        tooltip={{ trigger: "none" }}
                        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                        slots={{ pieArcLabel: ArcLabel }}
                        slotProps={{ legend: { hidden: true } }}
                        onItemClick={(_, d) => onItemClick(d)}
                        sx={{
                            ["& > g > g:nth-of-type(1) > g path"]: {
                                transition: "opacity 1s"
                            },
                            ["& > g > g:nth-of-type(2) > g path, & > g > g:nth-of-type(3) > g path"]: {
                                transition: "opacity 0.5s"
                            }
                        }}
                    />
                </animated.div>
                <IconButton className="fixed bottom-6 left-6" onClick={onReset}>
                    <Icons.Home className="w-8 h-8" />
                </IconButton>
                {stage != Stages.Intro && stage != Stages.First && (
                    <IconButton className="fixed bottom-6 right-6" onClick={onBack}>
                        <Icons.ArrowStepInLeft className="w-8 h-8" />
                    </IconButton>
                )}
            </div>
        </main>
    )
}