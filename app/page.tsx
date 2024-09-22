"use client";

import { useEffect, useRef, useState } from "react";
import NImage from "next/image";
import { animated, AnimationConfig, SpringConfig, useSpringValue, useTransition } from "@react-spring/web";
import { useInterval } from "@/components/useInterval";
import Button from "@/components/Button";
import Icons from "@/components/Icons";
import IconButton from "@/components/IconButton";
import { PieArcLabelProps, PieChart } from "@mui/x-charts/PieChart";
import { innerData, middleData, outerData } from "@/public/data";
import { configPieStyle, css, springConfig, updatePieStyle } from "@/public/utils";
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
    let past: number = 0;
    const angles = [453.5294, 395.2941, 337.0589, 268.2353, 199.4118, 506.4706], middleAngle = 10.5882, revealDelay = 1800;
    const xValues = [0, -200, -400];

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
    const childRanges = series[0].data.map(d => Array.from({ length: d.value }, () => past++));
    const fadeTransitionConfig = { from: { opacity: 0 }, enter: { opacity: 1 }, leave: { opacity: 0 }, config: { duration: 300 }, exitBeforeEnter: true };

    const [stage, setStage] = useState<Stages>(Stages.Intro);
    const [showHomeScreen, setHomeScreen] = useState(true);
    const [homePage, setHomePage] = useState<0 | 1 | 2>(0);
    const [fItemData, setFItemData] = useState<PieItemIdentifier>();
    const [sItemData, setSItemData] = useState<PieItemIdentifier & { factor: number}>();
    const [tItemData, setTItemData] = useState<PieItemIdentifier>();
    const [showHomeButton, setShowHomeButton] = useState(false);
    const [showBackButton, setShowBackButton] = useState(false);
    const rotateVal = useRef(0), arcTimeout = useRef<NodeJS.Timeout>();
    const rotateSpring = useSpringValue(rotateVal.current, springConfig), scaleSpring = useSpringValue(0, springConfig);
    const xSpring = useSpringValue(0, springConfig), ySpring = useSpringValue(0, springConfig);
    const labelOpacity = [useState(0), useState(0), useState(0)];
    const setRotateVal = (v: number, config?: Partial<AnimationConfig> | ((key: string) => SpringConfig)) => { rotateVal.current = v; !config ? rotateSpring.start(v) : rotateSpring.start(v, { config }); };
    const setLabelsOpacity = (l1: number, l2: number, l3: number) => { labelOpacity[0][1](l1); labelOpacity[1][1](l2); labelOpacity[2][1](l3); };
    const homeTransition = useTransition(showHomeScreen, fadeTransitionConfig);
    const pageTransition = useTransition(homePage, fadeTransitionConfig);
    const homeBtnTransition = useTransition(showHomeButton, fadeTransitionConfig);
    const backBtnTransition = useTransition(showBackButton, fadeTransitionConfig);

    useEffect(() => {
        scaleSpring.start(pieScale[stage]);
        setShowHomeButton(stage != Stages.Intro && stage != Stages.Final);
        setShowBackButton(stage == Stages.Second || stage == Stages.Third);
        clearTimeout(arcTimeout.current);

        if (stage === Stages.Intro) {
            setHomeScreen(true);
            setHomePage(0);

            xSpring.start(0);
            ySpring.start(0);

            configPieStyle(true, true, true);
        }
        else if (stage === Stages.First) {
            setHomeScreen(false);

            xSpring.start(xValues[0]);
            ySpring.start(50);

            configPieStyle(true, false, false);
            setLabelsOpacity(1, 0, 0);
        }
        else if (stage === Stages.Second && fItemData) {
            xSpring.start(xValues[1]);

            updatePieStyle(1, i => i == fItemData.dataIndex ? css.visible : css.faded);
            arcTimeout.current = setTimeout(() => {
                updatePieStyle(2, i => childRanges[fItemData.dataIndex].includes(i) ? css.active : css.invisible);
                setLabelsOpacity(1, 1, 0);
            }, xSpring.get() > xValues[1] ? revealDelay : 0);
            updatePieStyle(3, () => css.invisible);
        }
        else if (stage === Stages.Third && fItemData && sItemData) {
            xSpring.start(xValues[2]);

            updatePieStyle(2, i => i == sItemData.dataIndex ? css.visible : childRanges[fItemData.dataIndex].includes(i) ? css.faded : css.invisible);
            updatePieStyle(3, i => [sItemData.dataIndex * 2, sItemData.dataIndex * 2 + 1].includes(i) ? css.active : css.invisible);
            setLabelsOpacity(1, 1, 1);
        }
        else if (stage === Stages.Final && fItemData && sItemData && tItemData) {
            xSpring.start(0);
            ySpring.start(0);

            configPieStyle(true, true, true);
            setLabelsOpacity(0, 0, 0);

            setHomePage(2);
            setTimeout(() => setHomeScreen(true), 1500);
        }
    }, [stage]);

    useInterval(() => setRotateVal((rotateVal.current + 0.2) % 360, { friction: 0, tension: 0 }), stage === Stages.Intro ? 16 : null);

    function onStart() {
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
            setRotateVal(rotateVal.current + middleAngle * sItemData.factor);
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

            const range = childRanges[fItemData!.dataIndex], normalizer = range[0];
            const end = range[range.length - 1] - normalizer;
            const setPie = { ...pie, factor: pie.dataIndex - normalizer - end / 2 } 
            setSItemData(setPie);

            setRotateVal(rotateVal.current - middleAngle * setPie.factor);
        }
        else if (pie.seriesId === "outer") {
            setStage(Stages.Final);
            setTItemData(pie);

            setRotateVal(Math.ceil(rotateVal.current / 360) * 360);
        }
    }

    const ArcLabel = (props: PieArcLabelProps) => {
        const textSz = props.id == "inner" ? "text-[0.7rem]" : props.id == "middle" ? "text-[0.6rem]" : "text-[0.5rem]";
        const idx = series.find(s => s.id == props.id)!.data.findIndex(d => d.label === props.formattedArcLabel && d.color === props.color);
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
            if (stage === Stages.First)
                setOpacity(props.id == "inner" ? 1 : 0);
            else if (stage === Stages.Second && fItemData) {
                if (props.id == "inner") {
                    setOpacity(idx != fItemData.dataIndex ? 0.5 : 1);
                    setRotation(-angles[fItemData.dataIndex]);
                }
                else if (props.id == "middle" && childRanges[fItemData!.dataIndex].includes(idx))
                    setOpacity(1);
            }
            else if (stage === Stages.Third && fItemData && sItemData) {
                if (props.id == "inner") {
                    setOpacity(idx != fItemData.dataIndex ? 0.5 : 1);
                    setRotation(-angles[fItemData.dataIndex]);
                }
                else if (props.id == "middle" && childRanges[fItemData.dataIndex].includes(idx))
                    setOpacity(1);
                else if (props.id == "outer" && [sItemData.dataIndex * 2, sItemData.dataIndex * 2 + 1].includes(idx))
                    setOpacity(1);
            }
            else if (stage === Stages.Final && fItemData && sItemData && tItemData) {
                if (props.id == "inner")
                    setOpacity(idx != fItemData.dataIndex ? 0.5 : 1);
                else if (props.id == "middle" && childRanges[fItemData.dataIndex].includes(idx))
                    setOpacity(1);
                else if (props.id == "outer" && [sItemData.dataIndex * 2, sItemData.dataIndex * 2 + 1].includes(idx))
                    setOpacity(1);
            }
        }, [stage]);

        return (
            <text className={textSz + " fill-zinc-50 drop-shadow-md pointer-events-none"} textAnchor="middle" style={{ opacity: opacity, transform: `translate3d(${x}px, calc(${y}px + 0.2rem), 0px)`, transformOrigin: `${x}px ${y}px`, rotate: rotation ? `${rotation}deg` : props.id == "inner" ? "0" : props.id == "middle" ? `calc(${offset} * 10.5882deg - 120deg + 5.2941deg)` : `calc(${offset} * 5.2941deg - 120deg + 2.64705deg)` }}>{props.formattedArcLabel}</text>
        );
    };

    return (
        <main className="min-h-screen">
            {homeTransition((style, item) => item && (
                <animated.div className="h-full p-24 absolute inset-0 bg-zinc-50/75 backdrop-blur transition duration-500 z-30" style={style}>
                    {pageTransition((style, item) => (
                        item == 0 ? (
                            <animated.div className="flex flex-col justify-center items-center absolute inset-0 space-y-40" style={style}>
                                <div className="flex flex-col justify-center items-center space-y-10">
                                    <NImage src="/logo.svg" alt="Logo" width={72} height={72} />
                                    <h1 className="text-center text-7xl font-bold">Emotion Wheel</h1>
                                </div>
                                <div className="flex flex-col justify-center items-center space-y-10">
                                    <Button onClick={onStart}>Start</Button>
                                    <Button secondary onClick={() => setHomePage(1)}>
                                        <Icons.CircleQuestion className="w-6 h-6" />
                                        <span>How it works</span>
                                    </Button>
                                </div>
                            </animated.div>
                        ) : item == 1 ?(
                            <animated.div className="flex flex-col justify-center items-center absolute inset-0 space-y-24" style={style}>
                                <h2 className="text-center text-6xl font-bold">How it works</h2>
                                <div className="w-136 text-xl text-center space-y-5">
                                    <p>You will be asked what you feel three times, showing more precise emotions as the questions progress.</p>
                                    <p>Just select the emotion that better describes what you're feeling and an overview will be presented to you in the end.</p>
                                </div>
                                <Button secondary onClick={() => setHomePage(0)}>
                                    <Icons.ArrowLeft className="w-6 h-6" />
                                    <span>Go back</span>
                                </Button>
                            </animated.div>
                        ) : (
                            <animated.div className="flex flex-col justify-center items-center absolute inset-0 space-y-24" style={style}>
                                <h2 className="text-center text-6xl font-bold">Your emotional journey</h2>
                                <div className="flex flex-col justify-center items-center space-y-10">
                                    <div className="w-136 text-xl text-center space-y-5">
                                        <p>Here's your emotional journey, share it with your friends and inspire them to explore their feelings too!</p>
                                    </div>
                                    <div className="w-160 grid *:row-[1] *:col-[1]">
                                        <div className="flex justify-around items-center text-xl text-zinc-50 text-center drop-shadow-md z-10 *:w-1/3">
                                            <p>{innerData[fItemData!.dataIndex].label?.toString()}</p>
                                            <p>{middleData[sItemData!.dataIndex].label?.toString()}</p>
                                            <p>{outerData[tItemData!.dataIndex].label?.toString()}</p>
                                        </div>
                                        <svg viewBox="0 0 1387 150" className="w-full z-0" style={{ fillRule: "evenodd", clipRule: "evenodd", strokeLinejoin: "round", strokeMiterlimit: 2 }}>
                                            <g transform="matrix(1,0,0,1,-253.911,-390)">
                                                <g transform="matrix(1,0,0,1,-163.552,93.5793)">
                                                    <path d="M492.463,446.421C451.069,446.421 417.463,412.814 417.463,371.421C417.463,330.027 451.069,296.421 492.463,296.421L917.463,296.421L830.86,446.421L492.463,446.421Z" style={{ fill: innerData[fItemData!.dataIndex].color }}/>
                                                </g>
                                                <g transform="matrix(1,0,0,1,-176.806,93.5793)">
                                                    <path d="M1287.61,446.421L874.217,446.421L960.819,296.421L1374.22,296.421L1287.61,446.421Z" style={{ fill: middleData[sItemData!.dataIndex].color }}/>
                                                </g>
                                                <g transform="matrix(-1,-1.22465e-16,1.22465e-16,-1,2058.37,836.421)">
                                                    <path d="M492.463,296.421L917.463,296.421L830.86,446.421L492.463,446.421C451.069,446.421 417.463,412.814 417.463,371.421C417.463,330.027 451.069,296.421 492.463,296.421Z" style={{ fill: outerData[tItemData!.dataIndex].color }}/>
                                                </g>
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex justify-center items-center space-x-4">
                                    <Button secondary onClick={onReset}>
                                        <Icons.ArrowLeft className="w-6 h-6" />
                                        <span>Go back</span>
                                    </Button>
                                    <Button>Share</Button>
                                </div>
                            </animated.div>
                        )
                    ))}
                    <div className="flex flex-col justify-end items-end absolute bottom-8 right-8 text-right space-y-0.5">
                        <p className="text-xs font-normal">Based on the emotion wheel of</p>
                        <p className="text-xl">Junto Institute</p>
                    </div>
                </animated.div>
            ))}
            <div className="h-full flex justify-center items-center absolute inset-0">
                <p className={`absolute top-20 text-3xl text-center ${[Stages.First, Stages.Second, Stages.Third].includes(stage) ? "opacity-100 delay-1000" : "opacity-0"} duration-[2.5s] z-10`}>Choose the emotion that better describes you</p>
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
                            },
                            ["& > g > g:nth-of-type(4) > g"]: {
                                opacity: labelOpacity[0][0],
                                transition: "opacity 0.5s"
                            },
                            ["& > g > g:nth-of-type(5) > g"]: {
                                opacity: labelOpacity[1][0],
                                transition: "opacity 0.5s"
                            },
                            ["& > g > g:nth-of-type(6) > g"]: {
                                opacity: labelOpacity[2][0],
                                transition: "opacity 0.5s"
                            }
                        }}
                        skipAnimation
                    />
                </animated.div>
                {homeBtnTransition((style, item) =>
                    item && (
                        <animated.div className="fixed bottom-6 left-6" style={style}>
                            <IconButton onClick={onReset}>
                                <Icons.Home className="w-8 h-8" />
                            </IconButton>
                        </animated.div>
                    )
                )}
                {backBtnTransition((style, item) =>
                    item && (
                        <animated.div className="fixed bottom-6 right-6" style={style}>
                            <IconButton onClick={onBack}>
                                <Icons.ArrowStepInLeft className="w-8 h-8" />
                            </IconButton>
                        </animated.div>
                    )
                )}
            </div>
        </main>
    )
}