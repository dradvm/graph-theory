
import { GraphContext } from "@/App";
import { useContext, useEffect, useState } from "react";
import { Arrow, Circle, Group, Text } from "react-konva";

function MyEdge({ edge, radius, border }) {
    const { modeDirected, modePath, edges, findItem, points, state, algorithm } = useContext(GraphContext)
    const [current, setCurrent] = useState({
        pux: null,
        puy: null,
        pvx: null,
        pvy: null,
        pos1: {},
        pos2: {},
        pos3: {}
    })
    const radiusEdge = 16
    const borderEdge = 2

    const isReverseEdge = (edge) => {
        var check = false
        for (let i = 0; i < edges.length; i++) {
            if (edges[i].u === edge.v && edges[i].v === edge.u) {
                check = true;
                break
            }
        }
        return check
    }
    const isPath = () => {
        if (["Moore - Dijkstra", "Bellman - Ford", "Floyd - Warshall"].indexOf(algorithm) > -1) {
            if (edge.isPath) {
                return true
            }
        }
        return false
    }
    useEffect(() => {
        const pux = findItem(edge.u).position.x
        const puy = findItem(edge.u).position.y
        const pvx = findItem(edge.v).position.x
        const pvy = findItem(edge.v).position.y
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
            start: (pux + pvx) / 2 + dicX * Math.cos(degCos * Math.PI / 4) * 20,
            end: (puy + pvy) / 2 - dicY * Math.cos(degCos * Math.PI / 4) * 20,
            tension: 0.5
        }
        const pos3 = {
            x: pvx + dicX * Math.cos(degCos) * (border + radius),
            y: pvy + dicY * Math.sin(degCos) * (border + radius)
        }
        setCurrent({
            dicX, dicY,
            pux, puy,
            pvx, pvy,
            pos1,
            pos2,
            pos3
        })
    }, [edge, points])
    return (
        <Group
        >
            {modeDirected && edge.u !== edge.v ? <Arrow
                points={[
                    isReverseEdge(edge) ? current.pos1.x : current.pux,
                    isReverseEdge(edge) ? current.pos1.y : current.puy,
                    !isReverseEdge(edge) ? current.pos2.x : current.pos2.start,
                    !isReverseEdge(edge) ? current.pos2.y : current.pos2.end,
                    modeDirected ? current.pos3.x : current.pvx,
                    modeDirected ? current.pos3.y : current.pvy
                ]}
                stroke={isPath() ? state.pending : "white"}
                strokeWidth={2}
                fill="black"
                tension={current.pos2.tension}
            /> : <Arrow
                points={[
                    current.pux,
                    current.puy,
                    !isReverseEdge(edge) ? current.pos2.x : current.pos2.start,
                    !isReverseEdge(edge) ? current.pos2.y : current.pos2.end,
                    current.pvx,
                    current.pvy
                ]}
                stroke={isPath() ? state.pending : "white"}
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
                        stroke={isPath() ? state.pending : "white"}
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
                            text={isNaN(edge.w) ? "" : edge.w}
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
                x={isReverseEdge(edge) ? current.pos2.start : current.pos2.x}
                y={isReverseEdge(edge) ? current.pos2.end : current.pos2.y}
            >
                <Circle
                    radius={radiusEdge}
                    fill="white"
                    stroke="#ccc"
                    strokeWidth={borderEdge}
                />
                <Text
                    text={isNaN(edge.w) ? "" : edge.w}
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
