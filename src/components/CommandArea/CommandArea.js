import { Col, Container, Row, Stack } from "react-bootstrap";
import styles from "./CommandArea.module.scss"
import clsx from "clsx";
import MyButton from "../MyButton/MyButton";
import { useContext, useEffect, useState } from "react";
import { GraphContext } from "@/App";

function CommandArea() {
    const { setDataGraph, modeDirected, setModeDirected, modePath, setModePath, algorithm, setAlgorithm, setPoints, state } = useContext(GraphContext)
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
        if (valueInput.trim() === "") {
            error = true
            return
        }
        Array.from(valueInput).forEach((char) => {
            if (char !== "\n" && char !== " " && char !== "-" && !regNumberPos.test(char) && !error) {
                error = true
                runError("Your input does not allow character!!")
            }
        })
        const data = valueInput.split("\n")
        const dataGraph = data.shift().split(" ")
        var n = Number(dataGraph[0])
        var m = Number(dataGraph[1])
        var d = []
        if (algorithm === "QLDA") {
            d = Array.from(data.pop().split(" ").map((item) => Number(item)))
        }
        const matrix = ["Moore - Dijkstra", "Bellman - Ford", "Floyd - Warshall"].indexOf(algorithm) > -1 ? Array.from({ length: 100 }).map((item) => Array(100).fill(-1000)) : Array.from({ length: 100 }).map((item) => Array(100).fill(0))
        var dataEdge = data.map((item) => item.split(" ")).map((edge) => {
            {
                const u = Number(edge[0])
                const v = Number(edge[1])
                if (!Number.isNaN(u) && !Number.isNaN(v)) {
                    if (modePath) {
                        matrix[u][v] = Number(edge[2])
                        if (!modeDirected) {
                            matrix[v][u] = Number(edge[2])
                        }
                    }
                    else {
                        matrix[u][v] = 1
                        if (!modeDirected) {
                            console.log(matrix)
                            console.log(v)
                            console.log(matrix[v])
                            console.log(matrix[v][u])
                            matrix[v][u] = 1
                        }
                    }
                    if (algorithm === "QLDA") {
                        matrix[u][v] = d[u - 1]
                    }
                }
                var w = modePath ? Number(edge[2]) : NaN
                w = algorithm === "QLDA" ? d[u - 1] : w
                return { u: u, v: v, w: w, state: state.idle }

            }
        })
        if (dataEdge.length !== m && !error) {
            error = true
            runError("Your edges does not enough!!")
        }   
        if (d.length != n && d.length > 0) {
            error = true
            runError("Your values does not match number of point")
        }
        if (algorithm === "QLDA") {
            var a = n + 1
            var b = n + 2
            for (let i = 1; i <= n; i++) {
                var deg_a = 0
                var deg_b = 0
                for (let j = 1; j <= n; j++) {
                    if (matrix[j][i] !== 0) {
                        deg_a++
                    }
                    if (matrix[i][j] !== 0) {
                        deg_b++
                    }
                }
                if (deg_a === 0) {
                    matrix[a][i] = 9999
                    dataEdge.push({ u: a, v: i, w: 0, state: state.idle })
                    m++
                }
                if (deg_b === 0) {
                    matrix[i][b] = d[i - 1]
                    dataEdge.push({ u: i, v: b, w: d[i - 1], state: state.idle })
                    m++
                }
            }
            n += 2
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
                if (algorithm === "Moore - Dijkstra" && edge.w < 0) {
                    error = true
                    runError("Path must be equal or greater than 0")
                }
            })
        }
        if (!error) {
            dataEdge = dataEdge.map((item) => {
                return {
                    ...item,
                    secondText: undefined
                }
            })
            console.log(dataEdge)
            setDataGraph({
                n: n,
                points: [...Array(n).keys()].map((i) => i + 1),
                edges: dataEdge,
                matrix: matrix,
                d: d
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
        if (["DFS", "BFS", "Moore - Dijkstra"].indexOf(algorithm) === -1) {

        }
        else {
            setModeDirected(!modeDirected)
        }
    }
    const changeModePath = () => {
        resetInput()
        if (algorithm === null) {
            setModePath(!modePath)
        }

    }
    useEffect(() => {
        resetInput()
        if (["Tarjan", "Topo"].indexOf(algorithm) > -1) {
            setModeDirected(true)
            setModePath(false)
        }
        else if (["Moore - Dijkstra", "Bellman - Ford", "Floyd - Warshall", "QLDA", "ChuLiu", "Edmonds - Karp"].indexOf(algorithm) > -1) {
            setModeDirected(true)
            setModePath(true)
        }
        else if (["Kruskal", "Prim"].indexOf(algorithm) > -1) {
            setModeDirected(false)
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
