
import { GraphContext } from "@/App";
import { useContext, useEffect, useState } from "react";
import { Arrow, Circle, Group, Text } from "react-konva";

function MyEdge({ edge, radius, border }) {
    const { modeDirected, modePath, edges, points, state, algorithm } = useContext(GraphContext)
    const [current, setCurrent] = useState({
        pux: null,
        puy: null,
        pvx: null,
        pvy: null,
        pos1: {},
        pos2: {},
        pos3: {},
        text: undefined
    })
    var radiusEdge = 16
    const borderEdge = 2
    if (algorithm === "Edmonds - Karp") {
        radiusEdge = 26
    }
    const isReverseEdge = (edge) => {
        return edges.find((item) => item.u === edge.v && item.v === edge.u) !== undefined;
    }
    const findItem = (value) => {
        return points.find((item) => item.value === value)
    }
    const findIndexItem = (edge) => {
        var a = edges.filter((item) => item.u === edge.u && item.v === edge.v)
        a.sort()
        return a.indexOf(edge) + 1
    }
    const multipleEdge = (edge) => {
        var a = edges.filter((item) => item.u === edge.u && item.v === edge.v)
        return a.length !== 1
    }
    const isCurve = (edge) => {

        if (isReverseEdge(edge)) {
            return true
        }
        if (multipleEdge(edge)) {
            if (findIndexItem(edge) === 1) {
                return false
            }
            return true
        }
        return false
    }
    useEffect(() => {
        const index = findIndexItem(edge)
        const pux = findItem(edge.u).position.x
        const puy = findItem(edge.u).position.y
        const pvx = findItem(edge.v).position.x
        const pvy = findItem(edge.v).position.y
        const curve = algorithm === "ChuLiu" ? 25 : 20
        const degCos = Math.acos(Math.abs(pux - pvx) / Math.sqrt(Math.pow(pvx - pux, 2) + Math.pow(pvy - puy, 2)))
        const dicX = pux < pvx ? -1 : 1
        const dicY = puy < pvy ? -1 : 1
        const pos1 = {
            x: pux - dicX * Math.cos(degCos) * (border + radius),
            y: puy - dicY * Math.sin(degCos) * (border + radius)
        }
        const pos2 = {
            x: (pux + pvx) / 2,
            y: (puy + pvy) / 2,
            start: (pux + pvx) / 2 + dicX * Math.cos(degCos * Math.PI / 4) * curve * index,
            end: (puy + pvy) / 2 - dicY * Math.cos(degCos * Math.PI / 4) * curve * index,
            tension: 0.5
        }
        const pos3 = {
            x: pvx + dicX * Math.cos(degCos) * (border + radius),
            y: pvy + dicY * Math.sin(degCos) * (border + radius)
        }
        var text = isNaN(edge.w) ? "" : edge.w
        if (algorithm === "Edmonds - Karp" && edge.secondText !== undefined) {
            text = edge.secondText + "/" + edge.w
            radiusEdge = 20
        }
        setCurrent({
            dicX, dicY,
            pux, puy,
            pvx, pvy,
            pos1,
            pos2,
            pos3,
            text
        })
    }, [edge, points])
    return (
        <Group
        >
            {modeDirected && edge.u !== edge.v ? <Arrow
                points={[
                    isCurve(edge) ? current.pos1.x : current.pux,
                    isCurve(edge) ? current.pos1.y : current.puy,
                    !isCurve(edge) ? current.pos2.x : current.pos2.start,
                    !isCurve(edge) ? current.pos2.y : current.pos2.end,
                    modeDirected ? current.pos3.x : current.pvx,
                    modeDirected ? current.pos3.y : current.pvy
                ]}
                stroke={edge.state}
                strokeWidth={2}
                fill="black"
                tension={current.pos2.tension}
            /> : <Arrow
                points={[
                    current.pux,
                    current.puy,
                        !isCurve(edge) ? current.pos2.x : current.pos2.start,
                        !isCurve(edge) ? current.pos2.y : current.pos2.end,
                    current.pvx,
                    current.pvy
                ]}
                    stroke={edge.state}
                    strokeWidth={2}
                fill="black"
                tension={current.pos2.tension}
            />}
            {edge.u === edge.v ?
                <Group
                    x={current.pos2.x - radius}
                    y={current.pos2.y - radius}
                >
                    <Circle
                        radius={radius}
                        stroke="white"
                        strokeWidth={borderEdge}
                    />
                    <Arrow
                        x={radius}
                        y={-5}
                        rotation={60}
                        stroke={edge.state}
                        strokeWidth={2}
                        fill="black"
                        tension={current.pos2.tension}
                    />
                    <Group
                        x={-radius + border + 5}
                        y={-radius + border + 5}
                    >
                        <Circle
                            radius={radiusEdge}
                            fill="white"
                            stroke="#ccc"
                            strokeWidth={borderEdge}
                        />
                        <Text
                            text={current.text}
                            fontSize={11}
                            fill="black"
                            align="center"
                            verticalAlign="middle"
                            width={radiusEdge + borderEdge}
                            height={radiusEdge + borderEdge}
                            offsetX={(radiusEdge + borderEdge) / 2}
                            offsetY={(radiusEdge + borderEdge) / 2}
                        />
                    </Group>
                </Group>

                : ""}
            {modePath && edge.u !== edge.v && Object.keys(current.pos2).length !== 0 ? <Group
                x={isCurve(edge) ? current.pos2.start : current.pos2.x}
                y={isCurve(edge) ? current.pos2.end : current.pos2.y}
            >
                <Circle
                    radius={radiusEdge}
                    fill="white"
                    stroke="#ccc"
                    strokeWidth={borderEdge}
                />
                <Text
                    text={current.text}
                    fontSize={11}
                    fill="black"
                    align="center"
                    verticalAlign="middle"
                    width={radiusEdge + borderEdge}
                    height={radiusEdge + borderEdge}
                    offsetX={(radiusEdge + borderEdge) / 2}
                    offsetY={(radiusEdge + borderEdge) / 2}
                />
            </Group> : ""}
        </Group>

    );
}

export default MyEdge;
