
import { GraphContext } from "@/App";
import { useContext, useEffect, useState } from "react";
import { Circle, Group, Text } from "react-konva";

function MyCircle({ point, handleRender, radius, size, border, color, area, state }) {
    const { algorithm, dataGraph } = useContext(GraphContext)
    const [current, setCurrent] = useState(point)
    const [draggable, setDraggable] = useState(true)
    const handleCurrent = (e) => {
        var radiusBorder = radius + border
        var posX = e.target._lastPos.x
        var posY = e.target._lastPos.y
        if (posX - radiusBorder < 0) {
            posX += radiusBorder / 2
            setDraggable(false)
        } else if (posX + radiusBorder > area.width) {
            posX = posX - radiusBorder / 2
            setDraggable(false)
        }

        if (posY - radiusBorder < 0) {
            posY += radiusBorder / 2
            setDraggable(false)
        } else if (posY + radiusBorder > area.height) {
            posY = posY - radiusBorder / 2
            setDraggable(false)
        }
        var newCurrent = {
            ...current,
            position: {
                x: posX,
                y: posY
            }
        }
        setCurrent(newCurrent)
        handleRender(e, newCurrent)
        setDraggable(true)
    }

    useEffect(() => {
        var text = point.value
        if (point.secondText !== undefined && algorithm === "Tarjan") {
            text = text + " | " + point.secondText
        }
        if (algorithm === "QLDA") {
            if (dataGraph.n - 1 === point.value) {
                text = "\u03b1"
            }
            else if (dataGraph.n === point.value) {
                text = "\u03b2"
            }
        }
        setCurrent({
            ...point,
            text: text
        })
    }, [point])

    return (
        <Group
            x={current.position.x}
            y={current.position.y}
            draggable={draggable}
            onDragMove={handleCurrent}
        >
            <Circle radius={radius} fill={color} stroke={state} strokeWidth={border} />
            <Text
                text={current.text}
                align="center"
                verticalAlign="middle"
                fontSize={point.secondText !== undefined ? 14 : size}
                fill="black"
                width={radius + border}
                height={radius + border}
                offsetX={(radius + border) / 2}
                offsetY={(radius + border) / 2} />
        </Group>

    );
}

export default MyCircle;
