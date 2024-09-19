import { type CSSProperties } from "react";

export const springConfig = { config: { mass: 1, friction: 200, tension: 500, precision: 0.001 } };
export const css = {
    active: { opacity: "1", pointerEvents: "auto" } as CSSProperties,
    visible: { opacity: "1", pointerEvents: "none" } as CSSProperties,
    faded: { opacity: "0.25", pointerEvents: "none" } as CSSProperties,
    invisible: { opacity: "0", pointerEvents: "none" } as CSSProperties
}

export function updatePieStyle(series: 1 | 2 | 3, resolve: (i: number) => CSSProperties | undefined) {
    document.querySelectorAll<SVGPathElement>(`#wheel svg > g > g:nth-of-type(${series}) path`).forEach((val, key) => {
        const props = resolve(key);

        if (!props)
            return;

        Object.keys(props).forEach(key => (val as any).style[key] = props[key as keyof CSSProperties]);
    });
}

export function configPieStyle(s1: boolean, s2: boolean, s3: boolean) {
    updatePieStyle(1, () => s1 ? css.active : css.invisible);
    updatePieStyle(2, () => s2 ? css.active : css.invisible);
    updatePieStyle(3, () => s3 ? css.active : css.invisible);
}