import { Col, Container, Row, Stack } from "react-bootstrap";
import styles from "./CommandArea.module.scss"
import clsx from "clsx";
import MyButton from "../MyButton/MyButton";
import { useContext, useEffect, useState } from "react";
import { GraphContext } from "@/App";

function CommandArea() {
    const { setDataGraph, modeDirected, setModeDirected, modePath, setModePath, algorithm, setAlgorithm, setPoints } = useContext(GraphContext)
    const [timeoutId, setTimeoutId] = useState([])
    const [valueInput, setValueInput] = useState("")
    const regNumberPos = /^[0-9]+$/
    const regNumberNeg = /^-[0-9]+$/
    const resetInput = (e) => {
        setValueInput("")
        setDataGraph({
            n: 0,
            matrix: [],
            points: [],
            edge: []
        })
        setPoints([])
    }

    const runInput = (e) => {
        var error = false
        Array.from(valueInput).forEach((char) => {
            if (char !== "\n" && char !== " " && char !== "-" && !regNumberPos.test(char) && !error) {
                error = true
                runError("Your input does not allow character!!")
            }
        })
        const data = valueInput.split("\n")
        const dataGraph = data.shift().split(" ")
        const n = Number(dataGraph[0])
        const m = Number(dataGraph[1])
        const matrix = ["Moore - Dijkstra", "Bellman - Ford", "Floyd - Warshall"].indexOf(algorithm) > -1 ? Array.from({ length: 100 }).map((item) => Array(100).fill(-1)) : Array.from({ length: 100 }).map((item) => Array(100).fill(0))
        const dataEdge = data.map((item) => item.split(" ")).map((edge) => {
            {
                const u = Number(edge[0])
                const v = Number(edge[1])
                if (modePath) {
                    matrix[u][v] = Number(edge[2])
                    if (!modeDirected) {
                        matrix[v][u] = Number(edge[2])
                    }
                }
                else {
                    matrix[u][v] = 1
                    if (!modeDirected) {
                        matrix[v][u] = 1
                    }
                }
                return { u: u, v: v, w: modePath ? Number(edge[2]) : NaN, isPath: false }

            }
        })
        if (dataEdge.length !== m && !error) {
            error = true
            runError("Your edges does not enough!!")
        }
        if (!error) {
            dataEdge.forEach((edge) => {
                if (edge.u < 1 || edge.v < 1 || edge.u > n || edge.v > n) {
                    error = true
                    runError("Your point must be in range (1, " + n + ")")
                }
                if (isNaN(edge.w) && modePath) {
                    error = true
                    runError("You must enter path!!")
                }
            })
        }

        if (!error) {
            setDataGraph({
                n: n,
                points: [...Array(Number(dataGraph[0])).keys()].map((i) => i + 1),
                edges: dataEdge,
                matrix: matrix
            })
        }
    }
    const runError = (errorMessage) => {
        if (timeoutId.length === 0) {
            var currentValueInput = valueInput
            setValueInput(errorMessage)
            timeoutId.push(setTimeout(() => {
                setValueInput(currentValueInput)
                setTimeoutId([])
            }, 3000))
        }
    }
    const changeModeDirected = () => {
        resetInput()
        setModeDirected(!modeDirected)
    }
    const changeModePath = () => {
        resetInput()
        if (["DFS", "BFS"].indexOf(algorithm) > -1) {

        }
        else {
            setModePath(!modePath)
        }

    }
    useEffect(() => {
        resetInput()
        if (algorithm === "Tarjan") {
            setModeDirected(true)
            setModePath(false)
        }
        else if (["Moore - Dijkstra", "Bellman - Ford", "Floyd - Warshall"].indexOf(algorithm) > -1) {
            setModeDirected(true)
            setModePath(true)
        }
        else {
            setModeDirected(false)
            setModePath(false)
        }
    }, [algorithm])
    return (
        <Container fuild gap={0} style={{ height: "25%" }}>
            <Row className="h-100">
                <Col xs={7} className="d-flex">
                    <textarea className={clsx("w-100 py-2 px-3 lh-sm bg-black text-white", styles.cmd)} value={valueInput} onChange={(e) => setValueInput(e.target.value)} />
                </Col>
                <Col xs={5} className="d-flex">
                    <Stack gap={2}>
                        <div>
                            <MyButton value="Run" handleFunction={runInput} />
                        </div>
                        <div>
                            <MyButton value="Directed" handleFunction={changeModeDirected} selected={modeDirected} />
                        </div>
                        <div>
                            <MyButton value="Path" handleFunction={changeModePath} selected={modePath} />
                        </div>
                        <div>
                            <MyButton value="Reset" handleFunction={resetInput} />
                        </div>
                    </Stack>
                </Col>
            </Row>
        </Container>
    );
}

export default CommandArea;
