

import { Layer, Stage, Text, Group, Arrow, Line } from "react-konva";
import MyCircle from "@components/MyCircle/MyCircle";
import { useContext, useEffect, useState } from "react";
import { GraphContext } from "@/App";
import MyEdge from "../MyEdge/MyEdge";
function GraphContainer({ dimensions }) {
    const { dataGraph, points, setPoints, edges, setEdges, handlePointsSetPosition, algorithm, state } = useContext(GraphContext)

    const size = 200
    const radius = 32
    const border = 4
    useEffect(() => {
        if (dataGraph.n > 0) {
            const d = dimensions
            setPoints(dataGraph.points.map((i) => {
                return {
                    value: i,
                    position: {
                        x: d.width / 2 + Math.cos((Math.PI * 2 / dataGraph.points.length) * i) * size, y: d.height / 2 + Math.sin((Math.PI * 2 / dataGraph.points.length) * i) * size
                    },
                    secondText: undefined,
                    state: state.idle
                }
            }))
            setEdges(dataGraph.edges)
        }
    }, [dataGraph])

    return (
        <Stage width={dimensions.width} height={dimensions.height}>
            <Layer className="vh-100">
                {points.length !== 0 ? edges.map((item) =>
                    <MyEdge
                        edge={item}
                        border={border}
                        radius={radius}
                    />
                ) : ""}
                {points.length !== 0 ? points.map((item) =>
                    <MyCircle
                        point={item}
                        handleRender={handlePointsSetPosition}
                        color={"#fff"}
                        size={14}
                        radius={radius}
                        border={border}
                        area={dimensions}
                        state={item.state}
                    />
                ) : ""}
            </Layer>
        </Stage>
    );
}

export default GraphContainer;
