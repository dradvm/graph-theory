import { Col, Container, Row, Stack } from "react-bootstrap";
import ShowStepItemStack from "@/components/ShowStepItemStack/ShowStepItemStack";
import { useContext, useEffect, useState } from "react";
import { GraphContext } from "@/App";
import MyButton from "../MyButton/MyButton";
import clsx from "clsx";
import styles from "./ShowStep.module.scss"
function ShowStep() {
    const { dataGraph, points, setPoints, state, algorithm, time, modeDirected, setModeDirected, modePath, setModePath, edges, setEdges, dimensionsGraphContainer } = useContext(GraphContext)
    const [arrStepList] = useState([])
    const [arrStepList2] = useState([])
    const [arrStepList3] = useState([])
    const [markedList] = useState([])
    const [timeoutList] = useState([])
    const [arrStepShow, setArrStepShow] = useState([])
    const [arrStepShow2, setArrStepShow2] = useState([])
    const [markedShow, setMarkedShow] = useState([])
    const [marked, setMarked] = useState([])
    const [stack] = useState([])

    var keyTarjan = 1
    const [numTarjan, setNumTarjan] = useState([])
    const [minNumTarjan, setMinNumTarjan] = useState([])
    const [connectedComponentList] = useState([])
    const [minNumTarjanList] = useState([])
    const [minNumTarjanShow, setMinNumTarjanShow] = useState([])
    const color = ["#2986cc", "#6a329f", "#8fce00", "#f1c232", "#744700", "#1E7335", "#12f8c7", "#00d0ff", "#e13800", "#575e50"]

    const infinity = 99999
    const [piNum, setPiNum] = useState([])
    const [piNumList] = useState([])
    const [piNumShow, setPiNumShow] = useState([])
    const [parentNum, setParentNum] = useState([])
    const [parentNumList] = useState([])
    const [parentNumShow, setParentNumShow] = useState([])
    const [start, setStart] = useState(1)
    const [end, setEnd] = useState(0)

    const [arrEdgeList, setArrEdgeList] = useState([])
    const [minEdgeList, setMinEdgeList] = useState([])
    const [minEdgeShow, setMinEdgeShow] = useState()
    const [minValue, setMinValue] = useState(0)

    const [t, sett] = useState([])
    const [T, setT] = useState([])
    const DFS = (num) => {
        const stack = []
        let u
        stack.push(num)
        arrStepList.push(Array.from(stack))
        while (stack.length !== 0) {
            u = stack.pop()
            arrStepList.push(Array.from(stack))
            if (marked[u - 1]) {
                continue
            }
            marked[u - 1] = 1
            markedList.push(u)
            for (let i = 1; i <= dataGraph.n; i++) {
                if (dataGraph.matrix[u][i] === 1 && marked[i - 1] === 0) {
                    stack.push(i)
                    arrStepList.push(Array.from(stack))
                }
            }
        }
    }
    const runDFS = () => {
        resetAllData()
        marked.forEach((item, index) => marked[index] = 0)
        for (let i = 1; i <= dataGraph.n; i++) {
            if (marked[i - 1] === 0) {
                DFS(i)
            }
        }
        showDFS()
    }
    const showDFS = () => {
        var index = 0
        var timeoutId
        for (let i = 0; i < arrStepList.length; i++) {
            timeoutId = setTimeout(() => {
                setArrStepShow(arrStepList[i])
                if (i > 0 && arrStepList[i - 1][arrStepList[i - 1].length - 1] === markedList[index] && arrStepList[i].length < arrStepList[i - 1].length) {
                    setMarkedShow(markedList.slice(0, index + 1))
                    index++
                }
                setPoints(points.map((item) => {
                    var newState = state.idle
                    if (arrStepList[i].indexOf(item.value) > -1) {
                        newState = state.pending
                    }
                    if (markedList.slice(0, index).indexOf(item.value) > -1) {
                        newState = state.marked
                    }
                    return {
                        ...item,
                        state: newState
                    }
                }))
            }, time * i)
            timeoutList.push(timeoutId)
        }
    }
    const BFS = (num) => {
        const queue = []
        let u
        queue.push(num)
        arrStepList.push(Array.from(queue))
        while (queue.length !== 0) {
            u = queue.shift()
            arrStepList.push(Array.from(queue))
            if (marked[u - 1]) {
                continue
            }
            marked[u - 1] = 1
            markedList.push(u)
            for (let i = 1; i <= dataGraph.n; i++) {
                if (dataGraph.matrix[u][i] === 1 && marked[i - 1] === 0) {
                    queue.push(i)
                    arrStepList.push(Array.from(queue))
                }
            }
        }
    }
    const runBFS = () => {
        resetAllData()
        marked.forEach((item, index) => marked[index] = 0)
        for (let i = 1; i <= dataGraph.n; i++) {
            if (marked[i - 1] === 0) {
                BFS(i)
            }
        }
        showBFS()
    }
    const showBFS = () => {
        var index = 0
        var timeoutId
        for (let i = 0; i < arrStepList.length; i++) {
            timeoutId = setTimeout(() => {
                setArrStepShow(arrStepList[i])
                if (i > 0 && arrStepList[i - 1][0] === markedList[index] && arrStepList[i].length < arrStepList[i - 1].length) {
                    setMarkedShow(markedList.slice(0, index + 1))
                    index++
                }
                setPoints(points.map((item) => {
                    var newState = state.idle
                    if (arrStepList[i].indexOf(item.value) > -1) {
                        newState = state.pending
                    }
                    if (markedList.slice(0, index).indexOf(item.value) > -1) {
                        newState = state.marked
                    }
                    return {
                        ...item,
                        state: newState
                    }
                }))
            }, time * i)
            timeoutList.push(timeoutId)
        }
    }
    const Tarjan = (num) => {
        stack.push(num)
        numTarjan[num - 1] = keyTarjan
        minNumTarjan[num - 1] = keyTarjan
        arrStepList.push(Array.from(stack))
        if (markedList.length > 0) {
            markedList.push([...markedList[markedList.length - 1], num])
            minNumTarjanList.push(markedList[markedList.length - 1].map((item) => minNumTarjan[item - 1]))
        }
        else {
            markedList.push([num])
            minNumTarjanList.push([minNumTarjan[num - 1]])
        }
        keyTarjan++
        for (let i = 1; i <= dataGraph.n; i++) {
            if (dataGraph.matrix[num][i] === 1) {
                if (numTarjan[i - 1] === 0) {
                    Tarjan(i)
                    var num1 = minNumTarjan[num - 1]
                    var num2 = minNumTarjan[i - 1]
                    var arrTemp = []
                    if (num1 > num2) {
                        arrTemp.push(num1)
                        arrTemp.push(num2)
                    }
                    else {
                        arrTemp.push(num2)
                        arrTemp.push(num1)
                    }
                    minNumTarjan[num - 1] = Math.min(num1, num2)
                    arrStepList.push(Array.from(stack))
                    markedList.push([...markedList[markedList.length - 1]])
                    minNumTarjanList.push(markedList[markedList.length - 1].map((item) => item === num ? arrTemp : minNumTarjan[item - 1]))

                }
                else if (stack.indexOf(i) > -1) {
                    var num1 = minNumTarjan[num - 1]
                    var num2 = numTarjan[i - 1]
                    var arrTemp = []
                    if (num1 > num2) {
                        arrTemp.push(num1)
                        arrTemp.push(num2)
                    }
                    else {
                        arrTemp.push(num2)
                        arrTemp.push(num1)
                    }
                    minNumTarjan[num - 1] = Math.min(num1, num2)
                    arrStepList.push(Array.from(stack))
                    markedList.push([...markedList[markedList.length - 1]])
                    minNumTarjanList.push(markedList[markedList.length - 1].map((item) => item === num ? arrTemp : minNumTarjan[item - 1]))
                }
            }
        }
        if (numTarjan[num - 1] === minNumTarjan[num - 1]) {
            var x
            var strongConnect = []
            do {
                x = stack.pop()
                strongConnect.push(x)
                arrStepList.push(Array.from(stack))
                markedList.push([...markedList[markedList.length - 1]])
                minNumTarjanList.push(markedList[markedList.length - 1].map((item) => minNumTarjan[item - 1]))

            } while (x != num)
            connectedComponentList.push(strongConnect)
        }
    }
    const runTarjan = () => {
        resetAllData()
        for (let i = 1; i <= dataGraph.n; i++) {
            if (numTarjan[i - 1] === 0) {
                Tarjan(i)
            }
        }
        showTarjan()
    }
    const showTarjan = () => {
        var index = 0
        var indexConnectComponent = 0
        for (let i = 0; i < arrStepList.length; i++) {
            var timeoutId
            timeoutId = setTimeout(() => {
                setArrStepShow(arrStepList[i])
                setMarkedShow(markedList[i])
                setMinNumTarjanShow(minNumTarjanList[i])
                if (i > 0 && i < arrStepList.length && arrStepList[i].length < arrStepList[i - 1].length) {
                    indexConnectComponent++
                }
                if (index < connectedComponentList.length && connectedComponentList[index].length === indexConnectComponent && indexConnectComponent !== 0) {
                    index++
                    indexConnectComponent = 0
                }
                setPoints(points.map((item, indexP) => {
                    var newState = state.idle
                    if (arrStepList[i].indexOf(item.value) > -1) {
                        newState = state.pending
                    }
                    connectedComponentList.forEach((connectedComponent, indexCC) => {
                        if (indexCC < index) {
                            connectedComponent.forEach((value) => {
                                if (item.value === value) {
                                    newState = color[indexCC]
                                }
                            })
                        }
                        else if (indexConnectComponent > 0 && indexCC === index) {
                            connectedComponent.slice(0, indexConnectComponent).forEach((value) => {
                                if (item.value === value) {
                                    newState = color[indexCC]
                                }
                            })
                        }
                    })
                    var minNum = minNumTarjanList[i][markedList[i].indexOf(item.value)]
                    if (typeof minNum === "object") {
                        minNum = minNum[1]
                    }
                    var tarjanNum = markedList[i][minNum - 1]
                    return {
                        ...item,
                        secondText: tarjanNum,
                        state: newState
                    }
                }))
            }, time * i)
            timeoutList.push(timeoutId)
        }
    }
    const mooreDijkstra = (num) => {
        piNum[num - 1] = 0
        marked[num - 1] = 1
        var u_min = num
        piNumList.push(piNum.map((item) => item === infinity ? "\u221E" : item))
        arrStepList.push(piNum.map((item) => item === infinity ? "\u221E" : item))
        parentNumList.push(Array.from(parentNum))
        for (let i = 1; i < dataGraph.n; i++) {
            var max = infinity
            for (let j = 1; j <= dataGraph.n; j++) {
                if (piNum[j - 1] < max && marked[j - 1] === 0) {
                    max = piNum[j - 1]
                    u_min = j
                }
            }
            marked[u_min - 1] = 1
            arrStepList.push(piNum.map((item) => item === infinity ? "\u221E" : item))
            piNumList.push(piNum.map((item) => item === infinity ? "\u221E" : item))
            parentNumList.push(Array.from(parentNum))
            for (let j = 1; j <= dataGraph.n; j++) {
                if (dataGraph.matrix[u_min][j] !== -1000 && marked[j - 1] === 0) {
                    if (piNum[u_min - 1] + dataGraph.matrix[u_min][j] < piNum[j - 1]) {
                        var oldPiNum = piNum[j - 1]
                        piNum[j - 1] = piNum[u_min - 1] + dataGraph.matrix[u_min][j]
                        parentNumList.push(Array.from(parentNum))
                        parentNumList[parentNumList.length - 1][j - 1] = [parentNum[j - 1], u_min]
                        parentNum[j - 1] = u_min
                        piNumList.push(piNum.map((item) => item === infinity ? "\u221E" : item))
                        arrStepList.push(piNum.map((item) => item === infinity ? "\u221E" : item))
                        arrStepList[arrStepList.length - 1][j - 1] = piNum[u_min - 1] + " + " + dataGraph.matrix[u_min][j] + " < " + (oldPiNum === infinity ? "\u221E" : oldPiNum)

                    }
                }
            }

        }
        piNumList.push(piNum.map((item) => item === infinity ? "\u221E" : item))
        arrStepList.push(piNum.map((item) => item === infinity ? "\u221E" : item))
        parentNumList.push(Array.from(parentNum))
    }
    const runMooreDijkstra = () => {
        resetAllData()
        if (start < 0 || start > dataGraph.n) {
            setStart("Invalid start number!!")
            setTimeout(() => {
                setStart(1)
            }, 3000)
            return
        }
        if (end < 0 || end > dataGraph.n) {
            setEnd("Invalid end number!!")
            setTimeout(() => {
                setEnd(0)
            }, 3000)
            return
        }
        mooreDijkstra(start)
        showMooreDijkstra()

    }
    const showMooreDijkstra = () => {
        var timeoutId
        for (let i = 0; i < arrStepList.length; i++) {
            timeoutId = setTimeout(() => {
                setArrStepShow(arrStepList[i])
                setParentNumShow(parentNumList[i])
                setPoints(points.map((item) => {
                    return {
                        ...item,
                        state: state.idle,
                        secondText: piNumList[i][item.value - 1]
                    }
                }))
                if (i === arrStepList.length - 1) {
                    if (end !== 0) {
                        showPath()
                    }
                }
            }, time * i)
            timeoutList.push(timeoutId)
        }
    }
    const bellmanFord = (num) => {
        piNum[num - 1] = 0
        piNumList.push(piNum.map((item) => item === infinity ? "\u221E" : item))
        arrStepList.push(piNum.map((item) => item === infinity ? "\u221E" : item))
        parentNumList.push(Array.from(parentNum))
        for (let i = 1; i < dataGraph.n; i++) {
            dataGraph.edges.forEach((edge) => {
                if (piNum[edge.u - 1] !== infinity) {
                    if (piNum[edge.u - 1] + edge.w < piNum[edge.v - 1]) {
                        var oldPiNum = piNum[edge.v - 1]
                        piNum[edge.v - 1] = piNum[edge.u - 1] + edge.w
                        parentNum[edge.v - 1] = edge.u
                        piNumList.push(piNum.map((item) => item === infinity ? "\u221E" : item))
                        arrStepList.push(piNum.map((item) => item === infinity ? "\u221E" : item))
                        arrStepList[arrStepList.length - 1][edge.v - 1] = piNum[edge.u - 1] + " + " + edge.w + " < " + (oldPiNum === infinity ? "\u221E" : oldPiNum)
                        parentNumList.push(Array.from(parentNum))
                    }
                }
            })
        }

        piNumList.push(piNum.map((item) => item === infinity ? "\u221E" : item))
        arrStepList.push(piNum.map((item) => item === infinity ? "\u221E" : item))
        parentNumList.push(Array.from(parentNum))
    }
    const runBellmanFord = () => {
        resetAllData()
        if (start < 0 || start > dataGraph.n) {
            setStart("Invalid start number!!")
            setTimeout(() => {
                setStart(1)
            }, 3000)
            return
        }
        if (end < 0 || end > dataGraph.n) {
            setEnd("Invalid end number!!")
            setTimeout(() => {
                setEnd(0)
            }, 3000)
            return
        }
        bellmanFord(start)
        showBellmanFord()
    }
    const showBellmanFord = () => {
        showMooreDijkstra()
    }
    const floydWarshall = () => {
        const matrixFloyd = Array.from(dataGraph.matrix.slice(0, dataGraph.n + 1))
        matrixFloyd.forEach((item, index) => {
            matrixFloyd[index] = item.slice(0, dataGraph.n + 1).map((item2) => item2 === -1000 ? infinity : item2)
        })
        const arr = []
        for (let i = 1; i <= dataGraph.n; i++) {
            matrixFloyd[i][i] = 0
            for (let j = 1; j <= dataGraph.n; j++) {
                arr.push([i, j])
            }
        }
        matrixFloyd.splice(0, 1)
        matrixFloyd.forEach((item, index) => {
            matrixFloyd[index] = item.slice(1, item.length)
        })
        arrStepList.push([].concat(...matrixFloyd).map((item) => item === infinity ? "NO PATH" : item))
        for (let k = 1; k <= dataGraph.n; k++) {
            for (let i = 1; i <= dataGraph.n; i++) {
                for (let j = 1; j <= dataGraph.n; j++) {
                    if (matrixFloyd[i - 1][k - 1] === infinity || matrixFloyd[k - 1][j - 1] === infinity) {
                        continue
                    }
                    if (matrixFloyd[i - 1][j - 1] > matrixFloyd[i - 1][k - 1] + matrixFloyd[k - 1][j - 1]) {
                        const temp = Array.from(matrixFloyd.map((item) => Array.from(item)))
                        temp[i - 1][j - 1] = matrixFloyd[i - 1][k - 1] + " + " + matrixFloyd[k - 1][j - 1] + " < " + (matrixFloyd[i - 1][j - 1] === infinity ? "\u221E" : matrixFloyd[i - 1][j - 1])

                        arrStepList.push([].concat(...temp).map((item) => item === infinity ? "NO PATH" : item))
                        matrixFloyd[i - 1][j - 1] = matrixFloyd[i - 1][k - 1] + matrixFloyd[k - 1][j - 1]
                    }
                }
            }
        }

        arrStepList.push([].concat(...matrixFloyd).map((item) => item === infinity ? "NO PATH" : item))
        markedList.push(arr)
    }
    const runFloydWarshall = () => {
        resetAllData()
        floydWarshall()
        showFloydWarshall()
    }
    const showFloydWarshall = () => {
        setMarkedShow(markedList[0])
        var timeoutId
        for (let i = 0; i < arrStepList.length; i++) {
            timeoutId = setTimeout(() => {
                setArrStepShow(arrStepList[i])
            }, time * i)
        }
        timeoutList.push(timeoutId)
    }

    const showPath = () => {
        var num = end
        var arrNum = []
        while (num != -1) {
            arrNum.push(num)
            num = parentNum[num - 1]
        }
        arrNum = arrNum.reverse()
        var timeoutId
        for (let i = 1; i <= arrNum.length; i++) {
            timeoutId = setTimeout(() => {
                setPoints(points.map((item) => {
                    var newState = state.idle
                    if (arrNum.slice(0, i).indexOf(item.value) > -1) {
                        newState = state.pending
                    }
                    if (item.value === start) {
                        newState = state.marked
                    }
                    if (i === arrNum.length && item.value === end) {
                        newState = state.marked
                    }
                    return {
                        ...item,
                        state: newState,
                        secondText: piNum[item.value - 1] === infinity ? "\u221E" : piNum[item.value - 1]
                    }
                }))
                if (arrNum.length > 1) {
                    var arrTemp = []
                    for (let j = 1; j < i; j++) {
                        arrTemp.push([arrNum[j - 1], arrNum[j]])
                    }
                    setEdges(edges.map((edge) => {
                        var newState = state.idle
                        arrTemp.forEach((temp) => {
                            if (edge.u === temp[0] && edge.v === temp[1]) {
                                newState = state.pending
                            }
                        })
                        return {
                            ...edge,
                            state: newState
                        }
                    }))
                }
            }, time * i)
            timeoutList.push(timeoutId)
        }
    }
    const topo = () => {
        var L1 = []
        var L2 = []
        var d = []
        for (let i = 1; i <= dataGraph.n; i++) {
            let x = 0
            for (let j = 1; j <= dataGraph.n; j++) {
                if (dataGraph.matrix[j][i] !== 0) {
                    x++
                }
            }
            d.push(x)
            if (x === 0) {
                L1.push(i)
            }
        }
        markedList.push(Array.from(d))
        arrStepList.push(Array.from(L1))
        arrStepList2.push(Array.from(L2))
        arrStepList3.push(Array.from(marked))
        var rank = 1
        while (L1.length > 0) {
            L2 = []
            for (let i = 0; i < L1.length; i++) {
                let u = L1[i]
                marked[u - 1] = rank
                markedList.push(Array.from(d))
                arrStepList.push(Array.from(L1))
                arrStepList2.push(Array.from(L2))
                arrStepList3.push(Array.from(marked))
                for (let v = 1; v <= dataGraph.n; v++) {
                    if (dataGraph.matrix[u][v] !== 0 && d[v - 1] > 0) {
                        d[v - 1]--
                        if (d[v - 1] === 0) {
                            L2.push(v)
                        }
                        markedList.push(Array.from(d))
                        arrStepList.push(Array.from(L1))
                        arrStepList2.push(Array.from(L2))
                        arrStepList3.push(Array.from(marked))
                    }
                }
            }
            L1 = Array.from(L2)
            markedList.push(Array.from(d))
            arrStepList.push(Array.from(L1))
            arrStepList2.push(Array.from(L2))
            arrStepList3.push(Array.from(marked))
            rank++
        }
    }
    const runTopo = () => {
        resetAllData()
        topo()
        showTopo()
    }

    const showTopo = () => {
        var timeoutId
        for (let i = 0; i < arrStepList.length; i++) {
            timeoutId = setTimeout(() => {
                var maxRank = arrStepList3[i].reduce((max, item) => item > max ? item : max, arrStepList3[i][0])

                setPoints(points.map((item) => {
                    var indexHeight = 0
                    var sameRank = arrStepList3[i].reduce((c, rank, index) => {
                        let x = 0
                        if (rank === arrStepList3[i][item.value - 1]) {
                            x = 1
                            if ((index + 1) <= item.value) {
                                indexHeight++
                            }
                        }
                        return c + x
                    }, 0)
                    var x = (dimensionsGraphContainer.width / (maxRank + 1)) * arrStepList3[i][item.value - 1]
                    var y = (dimensionsGraphContainer.height / (sameRank + 1) * indexHeight)
                    return {
                        ...item,
                        position: {
                            x: x === 0 ? dimensionsGraphContainer.width : x,
                            y: y
                        }
                    }
                }))
                setArrStepShow(arrStepList[i])
                setArrStepShow2(arrStepList2[i])
                setMarkedShow(markedList[i])
            }, time * i)
            timeoutList.push(timeoutId)
        }

    }

    const kruskal = () => {
        var arrEdge = Array.from(edges).sort((a, b) => {
            if (a.w < b.w) {
                return -1
            }
            else {
                if (a.w === b.w) {
                    if (a < b) {
                        return -1
                    }
                    else {
                        return 1
                    }
                }
                return 1
            }
        })
        var arrEdge2 = Array.from(arrEdge)
        var tree = []
        var minEdge
        while (tree.length != dataGraph.n - 1 && arrEdge.length > 0) {
            minEdge = arrEdge.shift()
            marked[minEdge.u - 1] = marked[minEdge.u - 1] === 0 ? minEdge.u : marked[minEdge.u - 1]
            marked[minEdge.v - 1] = marked[minEdge.v - 1] === 0 ? minEdge.v : marked[minEdge.v - 1]
            if (marked[minEdge.u - 1] != marked[minEdge.v - 1]) {
                var rootU = marked[minEdge.u - 1]
                var rootV = marked[minEdge.v - 1]
                tree.push(minEdge)
                marked.forEach((item, index) => {
                    if (item === rootU) {
                        marked[index] = rootV
                    }
                })
            }
            arrStepList.push(Array.from(arrEdge2))
            minEdgeList.push(minEdge)
            arrEdgeList.push(Array.from(tree))
            markedList.push(Array.from(marked))
        }
        arrStepList.push(Array.from(arrEdge2))
        minEdgeList.push({})
        arrEdgeList.push(Array.from(tree))
        markedList.push(Array.from(marked))
    }
    const runKruskal = () => {
        resetAllData()
        kruskal()
        showKruskal()
    }
    const showKruskal = () => {
        var timeoutId
        for (let i = 0; i < arrStepList.length; i++) {
            timeoutId = setTimeout(() => {
                var pointTree = Array.from(new Set(arrEdgeList[i].reduce((arr, item) => arr.concat([item.u], [item.v]), [])))

                setPoints(points.map((item) => {
                    var newState = state.idle
                    if (pointTree.indexOf(item.value) > -1) {
                        newState = state.marked
                    }
                    if (minEdgeList[i].u === item.value || minEdgeList[i].v === item.value) {
                        newState = state.pending
                    }
                    return {
                        ...item,
                        state: newState
                    }
                }))
                setEdges(edges.map((item) => {
                    var newState = state.idle
                    if (arrEdgeList[i].indexOf(item) > -1) {
                        newState = state.marked
                    }
                    if (item === minEdgeList[i]) {
                        newState = state.pending
                    }
                    return {
                        ...item,
                        state: newState
                    }
                }))
                setMarkedShow(markedList[i])
                var arrEdgeState = []
                arrStepList[i].forEach((item) => {
                    if (arrEdgeList[i].indexOf(item) > -1) {
                        arrEdgeState.push([item, true])
                    }
                    else {
                        arrEdgeState.push([item, false])
                    }
                })
                setArrStepShow(arrEdgeState)
            }, time * i)
            timeoutList.push(timeoutId)
        }
    }

    const QLDA = () => {
        var L = []
        var L1 = []
        var L2 = []
        var d = []
        for (let i = 1; i <= dataGraph.n; i++) {
            let x = 0
            for (let j = 1; j <= dataGraph.n; j++) {
                if (dataGraph.matrix[j][i] !== 0) {
                    x++
                }
            }
            d.push(x)
            if (x === 0) {
                L1.push(i)
            }
        }
        var rank = 1
        arrStepList3.push(Array.from(marked))
        while (L1.length > 0) {
            L2 = []
            for (let i = 0; i < L1.length; i++) {
                let u = L1[i]
                L.push(u)
                marked[u - 1] = rank
                arrStepList3.push(Array.from(marked))
                for (let v = 1; v <= dataGraph.n; v++) {
                    if (dataGraph.matrix[u][v] !== 0 && d[v - 1] > 0) {
                        d[v - 1]--
                        if (d[v - 1] === 0) {
                            L2.push(v)
                        }
                    }
                }
            }
            L1 = Array.from(L2)
            rank++
        }
        for (let i = 0; i < L.length; i++) {
            let u = L[i]
            for (let v = 1; v <= dataGraph.n; v++) {
                if (dataGraph.matrix[u][v]) {
                    t[v - 1] = t[u - 1] + dataGraph.d[u - 1] > t[v - 1] ? t[u - 1] + dataGraph.d[u - 1] : t[v - 1]
                }
            }
        }
        T[dataGraph.n - 1] = t[dataGraph.n - 1]
        for (let i = L.length - 1; i >= 0; i--) {
            let v = L[i]
            for (let u = 1; u <= dataGraph.n; u++) {
                if (dataGraph.matrix[u][v]) {
                    T[u - 1] = T[v - 1] - dataGraph.d[u - 1] < T[u - 1] ? T[v - 1] - dataGraph.d[u - 1] : T[u - 1]
                }
            }
        }
        var path = []
        arrEdgeList.push(Array.from(path))
        for (let i = dataGraph.n; i >= 1; i--) {
            if (t[i - 1] === T[i - 1]) {
                path.push(i)
                arrEdgeList.push(Array.from(path))

            }
        }
        if (path.indexOf(dataGraph.n - 1) === -1) {
            path.push(dataGraph.n - 1)
            arrEdgeList.push(Array.from(path))
        }
    }
    const runQLDA = () => {
        resetAllData()
        QLDA()
        showQLDA()
    }
    const showQLDA = () => {
        var timeoutId
        var newPointPosition
        for (let i = 0; i < arrStepList3.length; i++) {
            timeoutId = setTimeout(() => {
                var maxRank = arrStepList3[i].reduce((max, item) => item > max ? item : max, arrStepList3[i][0])
                setPoints(points.map((item) => {
                    var indexHeight = 0
                    var newState = state.idle
                    var sameRank = arrStepList3[i].reduce((c, rank, index) => {
                        let x = 0
                        if (rank === arrStepList3[i][item.value - 1]) {
                            x = 1
                            if ((index + 1) <= item.value) {
                                indexHeight++
                            }
                        }
                        return c + x
                    }, 0)
                    var x = (dimensionsGraphContainer.width / (maxRank + 1)) * arrStepList3[i][item.value - 1]
                    var y = (dimensionsGraphContainer.height / (sameRank + 1) * indexHeight)
                    return {
                        ...item,
                        state: newState,
                        position: {
                            x: x === 0 ? dimensionsGraphContainer.width : x,
                            y: y
                        }
                    }
                }))
            }, time * i)
            timeoutList.push(timeoutId)
        }
        if (true) {
            let i = arrStepList3.length - 1
            var maxRank = arrStepList3[i].reduce((max, item) => item > max ? item : max, arrStepList3[i][0])
            newPointPosition = points.map((item) => {
                var indexHeight = 0

                var sameRank = arrStepList3[i].reduce((c, rank, index) => {
                    let x = 0
                    if (rank === arrStepList3[i][item.value - 1]) {
                        x = 1
                        if ((index + 1) <= item.value) {
                            indexHeight++
                        }
                    }
                    return c + x
                }, 0)
                var x = (dimensionsGraphContainer.width / (maxRank + 1)) * arrStepList3[i][item.value - 1]
                var y = (dimensionsGraphContainer.height / (sameRank + 1) * indexHeight)
                return {
                    ...item,
                    position: {
                        x: x === 0 ? dimensionsGraphContainer.width : x,
                        y: y
                    },
                }
            })
        }
        for (let i = 0; i < arrEdgeList.length; i++) {
            timeoutId = setTimeout(() => {
                setPoints(Array.from(newPointPosition).map((item) => {
                    var newState = state.idle
                    if (arrEdgeList[i].indexOf(item.value) > -1) {
                        newState = state.marked
                    }
                    return {
                        ...item,
                        state: newState
                    }
                }))
                setEdges(edges.map((item) => {
                    var newState = state.idle;
                    if (arrEdgeList[i].indexOf(item.u) > -1 && arrEdgeList[i].indexOf(item.v) > -1) {
                        if (arrEdgeList[i].indexOf(item.v) + 1 === arrEdgeList[i].indexOf(item.u)) {
                            newState = state.marked
                        }
                    }
                    return {
                        ...item,
                        state: newState
                    }
                }))
            }, (i + arrStepList3.length) * time)
            timeoutList.push(timeoutId)
        }
    }


    const prim = (num) => {
        piNum[num - 1] = 0
        marked[num - 1] = 1
        var u_min = num
        var tree = []
        var minEdge = undefined
        var sum = 0;
        for (let i = 1; i <= dataGraph.n; i++) {
            var max = infinity
            minEdge = undefined
            for (let j = 1; j <= dataGraph.n; j++) {
                if (piNum[j - 1] < max && marked[j - 1] === 0) {
                    max = piNum[j - 1]
                    u_min = j
                }
            }
            marked[u_min - 1] = 1
            for (let j = 1; j <= dataGraph.n; j++) {
                if (dataGraph.matrix[u_min][j] !== 0 && marked[j - 1] === 0) {
                    if (dataGraph.matrix[u_min][j] < piNum[j - 1]) {
                        piNum[j - 1] = dataGraph.matrix[u_min][j]
                    }
                }
            }
            markedList.push(Array.from(marked))
            piNumList.push(piNum.map((item) => item == infinity ? "\u221E" : item))
            var listEdge = []
            for (let u = 1; u <= dataGraph.n; u++) {
                for (let v = 1; v <= dataGraph.n; v++) {
                    if (dataGraph.matrix[u][v] !== 0 && marked[u - 1] === 1 && marked[v - 1] === 0) {
                        listEdge.push(edges.find((edge) => (edge.u === u && edge.v === v) || (edge.u === v && edge.v === u)))
                    }
                }
            }
            arrStepList.push(listEdge)
            arrEdgeList.push(Array.from(tree))
            minEdgeList.push(minEdge)

            markedList.push(Array.from(marked))
            piNumList.push(piNum.map((item) => item == infinity ? "\u221E" : item))
            arrStepList.push(listEdge)
            minEdge = listEdge.reduce((minEdge, edge) => {
                if (edge.w < minEdge.w) {
                    return edge
                }
                else if (edge.w === minEdge.w && edge.v < minEdge.v) {
                    return edge
                }
                return minEdge
            }, listEdge[0])
            tree.push(minEdge)
            arrEdgeList.push(Array.from(tree))
            minEdgeList.push(minEdge)
            sum += minEdge === undefined ? 0 : minEdge.w
        }
        setMinValue(sum)
    }
    const runPrim = () => {
        resetAllData()
        if (start < 0 || start > dataGraph.n) {
            setStart("Invalid start number!!")
            setTimeout(() => {
                setStart(1)
            }, 3000)
            return
        }
        prim(start)
        showPrim()
    }
    const showPrim = () => {
        var timeoutId
        for (let i = 0; i < markedList.length; i++) {
            timeoutId = setTimeout(() => {
                var pointPending = Array.from(new Set(arrStepList[i].reduce((arr, item) => arr.concat([item.u, item.v]), [])))

                setPoints(points.map((item) => {
                    var newState = state.idle
                    if (pointPending.indexOf(item.value) > -1) {
                        newState = state.pending
                    }
                    if (markedList[i][item.value - 1] === 1) {
                        newState = state.marked
                    }
                    return {
                        ...item,
                        state: newState
                    }
                }))
                setEdges(edges.map((item) => {
                    var newState = state.idle
                    if (arrStepList[i].indexOf(item) > -1) {
                        newState = state.pending
                    }
                    if (arrEdgeList[i].indexOf(item) > -1) {
                        newState = state.marked
                    }
                    return {
                        ...item,
                        state: newState
                    }
                }))
                setPiNumShow(piNumList[i])
                setArrStepShow(arrStepList[i])
                setMinEdgeShow(minEdgeList[i])
            }, time * i)
            timeoutList.push(timeoutId)
        }
    }

    const buildH = (G) => {
        var H = []
        var point = Array.from(new Set(G.edges.reduce((arr, item) => arr.concat([item.u, item.v]), [])))
        point.sort()
        for (let i = 0; i < point.length; i++) {
            var v = point[i]
            var edge = { w: 9999 }
            for (let e = 0; e < G.edges.length; e++) {
                if (G.edges[e].v === v) {
                    if (G.edges[e].w < edge.w) {
                        edge = G.edges[e]
                    }
                }
            }
            if (edge.w !== 9999) {
                H.push(edge)
            }
        }
        return { n: dataGraph.n, edges: H }
    }

    const isCycle = (H) => {
        var point = Array.from(new Set(H.edges.reduce((arr, item) => arr.concat([item.u, item.v]), [])))

        for (let i = 0; i < point.length; i++) {
            var root = point[i]
            var u = root
            while (true) {
                var edge = H.edges.find((item) => item.u === u)
                if (edge !== undefined) {
                    if (edge.v === root) {
                        return true
                    }
                    u = edge.v
                }
                else {
                    break
                }
            }
        }
        return false;
    }
    const contract = (G, H) => {
        var bplt = []
        var markPoint = []
        var point = Array.from(new Set(G.edges.reduce((arr, item) => arr.concat([item.u, item.v]), [])))
        H.edges.forEach((item) => {
            var root = item.u
            var u = root
            var arr = [item.u]
            if (markPoint.indexOf(root) === -1) {
                while (true) {
                    var edge = H.edges.find((e) => e.u === u)
                    if (edge.v === root) {
                        break;
                    }
                    if (edge !== undefined) {
                        u = edge.v
                        arr.push(u)
                    }
                    else {
                        break;
                    }
                }
                markPoint = Array.from(new Set(markPoint.concat(arr)))
                bplt.push(arr)
            }

        })
        for (let i = 0; i < point.length; i++) {
            if (markPoint.indexOf(point[i]) === -1) {
                bplt.push([point[i]])
            }
        }
        var edgeG1 = []
        G.edges.forEach((item) => {
            var u = bplt.find((bp) => bp.indexOf(item.u) > -1)
            var v = bplt.find((bp) => bp.indexOf(item.v) > -1)
            if (u !== v) {
                var edge = H.edges.find((edge) => edge.v === item.v)
                var w = item.w
                if (edge !== undefined) {
                    w -= edge.w
                }
                edgeG1.push({ u, v, w, state: state.idle, linkU: item.u, linkV: item.v })
            }
        })
        edgeG1.sort()
        return { n: G.n, edges: edgeG1 }
    }
    const expand = (H1, H, G1) => {
        H1.edges.forEach((edge) => {
            var ed = H.edges.find((item) => item.v === edge.linkV)
            var ed2 = G1.edges.find((item) => item.u === edge.linkU && item.v === edge.linkV)
            H.edges = H.edges.filter((item) => item !== ed)
            H.edges.push({ ...edge, u: edge.linkU, v: edge.linkV, w: edge.w + ed.w, linkU: ed2.linkU, linkV: ed2.linkV })
        })
    }

    const chuLiu = () => {
        const G = []
        const H = []
        const newEdge = dataGraph.edges.map((item) => {
            return {
                ...item,
                linkU: -1,
                linkV: -1
            }
        })
        G.push({ n: dataGraph.n, edges: newEdge })
        var t = 0
        while (true) {
            H.push(buildH(G[t]))
            if (!isCycle(H[t])) {
                break;
            }
            G.push(contract(G[t], H[t]))
            t++
        }
        while (t > 0) {
            expand(H[t], H[t - 1], G[t - 1])
            t--
        }

    }
    const runChuLiu = () => {
        resetAllData()
        chuLiu()
        showChuLiu()
    }
    const showChuLiu = () => {

        console.log(points)
        console.log(edges)
    }

    const resetAll = () => {
        setMarked(Array(dataGraph.n).fill(0))
        setNumTarjan(Array(dataGraph.n).fill(0))
        setMinNumTarjan(Array(dataGraph.n).fill(0))
        setPiNum(Array(dataGraph.n).fill(infinity))
        setParentNum(Array(dataGraph.n).fill(-1))
        sett(Array(dataGraph.n).fill(0))
        setT(Array(dataGraph.n).fill(infinity))
        setMinEdgeShow(undefined)
        setMinValue(0)
        arrStepList.splice(0)
        arrStepList2.splice(0)
        arrStepList3.splice(0)
        markedList.splice(0)
        minNumTarjanList.splice(0)
        parentNumList.splice(0)
        piNumList.splice(0)
        stack.splice(0)
        arrStepShow.splice(0)
        arrStepShow2.splice(0)
        markedShow.splice(0)
        minNumTarjanShow.splice(0)
        piNumShow.splice(0)
        parentNumShow.splice(0)
        connectedComponentList.splice(0)
        arrEdgeList.splice(0)
        minEdgeList.splice(0)
        timeoutList.forEach((timeoutId) => {
            clearTimeout(timeoutId)
        })
        timeoutList.splice(0)

    }
    const resetAllData = () => {
        resetAll()
        setPoints(points.map((item) => {
            return {
                ...item,
                state: state.idle,
                secondText: undefined
            }
        }))
        setEdges(edges.map((item) => {
            return {
                ...item,
                state: state.idle
            }
        }))
    }
    useEffect(() => {
        resetAll()
        setStart(1)
        setEnd(0)
    }, [dataGraph])

    useEffect(() => {
        resetAllData()
    }, [algorithm, time, modePath, modeDirected])


    return (
        <Container fuild className="overflow-auto" style={{ height: "400px" }}>
            {algorithm === "DFS" ? <Row>
                <div className="w-100 mb-2">
                    <MyButton value="Run" handleFunction={runDFS} />
                </div>
                <Col xs={6}>
                    <div className="text-white d-flex justify-content-around fw-bold" style={{ fontSize: "0.7rem" }} >STACK</div>
                    <Stack>
                        {arrStepShow !== undefined ? arrStepShow.map((item) => <ShowStepItemStack value={item} />) : ""}
                    </Stack>
                </Col>
                <Col xs={6}>
                    <div className="text-white d-flex justify-content-around fw-bold" style={{ fontSize: "0.7rem" }} >LIST MARKED</div>

                    <Stack>
                        {markedShow !== undefined ? markedShow.map((item) => <ShowStepItemStack value={item} />) : ""}

                    </Stack>
                </Col>
            </Row> : ""}
            {algorithm === "BFS" ? <Row>
                <div className="w-100 mb-2">
                    <MyButton value="Run" handleFunction={runBFS} />
                </div>
                <Col xs={6}>
                    <div className="text-white d-flex justify-content-around fw-bold" style={{ fontSize: "0.7rem" }} >QUEUE</div>
                    <Stack>
                        {arrStepShow !== undefined ? arrStepShow.map((item) => <ShowStepItemStack value={item} />) : ""}
                    </Stack>
                </Col>
                <Col xs={6}>
                    <div className="text-white d-flex justify-content-around fw-bold" style={{ fontSize: "0.7rem" }} >LIST MARKED</div>

                    <Stack>
                        {markedShow !== undefined ? markedShow.map((item) => <ShowStepItemStack value={item} />) : ""}

                    </Stack>
                </Col>
            </Row> : ""}
            {algorithm === "Tarjan" ? <Row>
                <div className="w-100 mb-2">
                    <MyButton value="Run" handleFunction={runTarjan} />
                </div>
                <Col xs={4}>
                    <div className="text-white d-flex justify-content-around fw-bold" style={{ fontSize: "0.7rem" }} >STACK</div>
                    <Stack>
                        {arrStepShow !== undefined ? arrStepShow.map((item) => <ShowStepItemStack value={item} />) : ""}
                    </Stack>
                </Col>
                <Col xs={4}>
                    <div className="text-white d-flex justify-content-around fw-bold" style={{ fontSize: "0.7rem" }} >NUM</div>
                    <Stack>
                        {markedShow !== undefined ? markedShow.map((item, index) => <ShowStepItemStack value={(index + 1) + " | " + item} />) : ""}
                    </Stack>
                </Col>
                <Col xs={4}>
                    <div className="text-white d-flex justify-content-around fw-bold" style={{ fontSize: "0.7rem" }} >MIN NUM</div>
                    <Stack>
                        {minNumTarjanShow !== undefined ? minNumTarjanShow.map((item) => <ShowStepItemStack value={Array.isArray(item) ? item.join(" | ") : item} />) : ""}
                    </Stack>
                </Col>
            </Row> : ""}
            {algorithm === "Moore - Dijkstra" ? <Row>
                <div className="w-100 mb-2">
                    <MyButton value="Run" handleFunction={runMooreDijkstra} />
                </div>
                <Col xs={6} className="mb-2">
                    <Stack>
                        <div className="text-white d-flex justify-content-around fw-bold" style={{ fontSize: "0.7rem" }} >START</div>
                        <input type={Number.isInteger(start) ? "number" : "text"} className={clsx(styles.cmd)} value={start} onChange={(e) => setStart(Number(e.target.value))} />
                    </Stack>
                </Col>
                <Col xs={6} className="mb-2">
                    <Stack>
                        <div className="text-white d-flex justify-content-around fw-bold" style={{ fontSize: "0.7rem" }} >END</div>
                        <input type={Number.isInteger(start) ? "number" : "text"} className={clsx(styles.cmd)} value={end} onChange={(e) => setEnd(Number(e.target.value))} />
                    </Stack>
                </Col>
                <Col xs={6}>
                    <div className="text-white d-flex justify-content-around fw-bold" style={{ fontSize: "0.7rem" }} >PI NUM</div>
                    <Stack>
                        {arrStepShow !== undefined ? arrStepShow.map((item, index) => <ShowStepItemStack value={(index + 1) + " | " + item} />) : ""}
                    </Stack>
                </Col>
                <Col xs={6}>
                    <div className="text-white d-flex justify-content-around fw-bold" style={{ fontSize: "0.7rem" }} >PARENT NUM</div>
                    <Stack>
                        {parentNumShow !== undefined ? parentNumShow.map((item) => <ShowStepItemStack value={Array.isArray(item) ? item.join(" | ") : item} />) : ""}
                    </Stack>
                </Col>
            </Row> : ""}
            {algorithm === "Bellman - Ford" ? <Row>
                <div className="w-100 mb-2">
                    <MyButton value="Run" handleFunction={runBellmanFord} />
                </div>
                <Col xs={6} className="mb-2">
                    <Stack>
                        <div className="text-white d-flex justify-content-around fw-bold" style={{ fontSize: "0.7rem" }} >START</div>
                        <input type={Number.isInteger(start) ? "number" : "text"} className={clsx(styles.cmd)} value={start} onChange={(e) => setStart(Number(e.target.value))} />
                    </Stack>
                </Col>
                <Col xs={6} className="mb-2">
                    <Stack>
                        <div className="text-white d-flex justify-content-around fw-bold" style={{ fontSize: "0.7rem" }} >END</div>
                        <input type={Number.isInteger(start) ? "number" : "text"} className={clsx(styles.cmd)} value={end} onChange={(e) => setEnd(Number(e.target.value))} />
                    </Stack>
                </Col>
                <Col xs={6}>
                    <div className="text-white d-flex justify-content-around fw-bold" style={{ fontSize: "0.7rem" }} >PI NUM</div>
                    <Stack>
                        {arrStepShow !== undefined ? arrStepShow.map((item, index) => <ShowStepItemStack value={(index + 1) + " | " + item} />) : ""}
                    </Stack>
                </Col>
                <Col xs={6}>
                    <div className="text-white d-flex justify-content-around fw-bold" style={{ fontSize: "0.7rem" }} >PARENT NUM</div>
                    <Stack>
                        {parentNumShow !== undefined ? parentNumShow.map((item) => <ShowStepItemStack value={Array.isArray(item) ? item.join(" | ") : item} />) : ""}
                    </Stack>
                </Col>
            </Row> : ""}
            {algorithm === "Floyd - Warshall" ? <Row>
                <div className="w-100 mb-2">
                    <MyButton value="Run" handleFunction={runFloydWarshall} />
                </div>
                <Col xs={6}>
                    <div className="text-white d-flex justify-content-around fw-bold" style={{ fontSize: "0.7rem" }} >EDGES</div>
                    <Stack>
                        {markedShow !== undefined ? markedShow.map((item) => <ShowStepItemStack value={item[0] + " ---> " + item[1]} />) : ""}
                    </Stack>
                </Col>
                <Col xs={6}>
                    <div className="text-white d-flex justify-content-around fw-bold" style={{ fontSize: "0.7rem" }} >VALUE</div>
                    <Stack>
                        {arrStepShow !== undefined ? arrStepShow.map((item) => <ShowStepItemStack value={item} />) : ""}
                    </Stack>
                </Col>
            </Row> : ""}
            {algorithm === "Topo" ? <Row>
                <div className="w-100 mb-2">
                    <MyButton value="Run" handleFunction={runTopo} />
                </div>
                <Col xs={4}>
                    <div className="text-white d-flex justify-content-around fw-bold" style={{ fontSize: "0.7rem" }} >DEGREE</div>
                    <Stack>
                        {markedShow !== undefined ? markedShow.map((item) => <ShowStepItemStack value={item} />) : ""}
                    </Stack>
                </Col>
                <Col xs={4}>
                    <div className="text-white d-flex justify-content-around fw-bold" style={{ fontSize: "0.7rem" }} >LIST1</div>
                    <Stack>
                        {arrStepShow !== undefined ? arrStepShow.map((item) => <ShowStepItemStack value={item} />) : ""}
                    </Stack>
                </Col>
                <Col xs={4}>
                    <div className="text-white d-flex justify-content-around fw-bold" style={{ fontSize: "0.7rem" }} >LIST2</div>
                    <Stack>
                        {arrStepShow2 !== undefined ? arrStepShow2.map((item) => <ShowStepItemStack value={item} />) : ""}
                    </Stack>
                </Col>
            </Row> : ""}
            {algorithm === "QLDA" ? <Row>
                <div className="w-100 mb-2">
                    <MyButton value="Run" handleFunction={runQLDA} />
                </div>
            </Row> : ""}
            {algorithm === "Kruskal" ? <Row>
                <div className="w-100 mb-2">
                    <MyButton value="Run" handleFunction={runKruskal} />
                </div>
                <Col xs={6}>
                    <div className="text-white d-flex justify-content-around fw-bold" style={{ fontSize: "0.7rem" }} >MARK</div>
                    <Stack>
                        {markedShow !== undefined ? markedShow.map((item) => <ShowStepItemStack value={item} />) : ""}
                    </Stack>
                </Col>
                <Col xs={6}>
                    <div className="text-white d-flex justify-content-around fw-bold" style={{ fontSize: "0.7rem" }} >EDGES</div>
                    <Stack>
                        {arrStepShow !== undefined ? arrStepShow.map((item) => <ShowStepItemStack value={"(" + item[0].u + ", " + item[0].v + ")"} state={item[1]} />) : ""}
                    </Stack>
                </Col>
            </Row> : ""}
            {algorithm === "Prim" ? <Row>
                <div className="w-100 mb-2">
                    <MyButton value="Run" handleFunction={runPrim} />
                </div>
                <Col xs={12} className="mb-2">
                    <Stack>
                        <div className="text-white d-flex justify-content-around fw-bold" style={{ fontSize: "0.7rem" }} >START</div>
                        <input type={Number.isInteger(start) ? "number" : "text"} className={clsx(styles.cmd)} value={start} onChange={(e) => setStart(Number(e.target.value))} />
                    </Stack>
                </Col>

                <Col xs={4}>
                    <div className="text-white d-flex justify-content-around fw-bold" style={{ fontSize: "0.7rem" }} >POINTS</div>
                    <Stack>
                        {piNumShow !== undefined ? piNumShow.map((item) => <ShowStepItemStack value={item} />) : ""}
                    </Stack>
                </Col>
                <Col xs={4}>
                    <div className="text-white d-flex justify-content-around fw-bold" style={{ fontSize: "0.7rem" }} >EDGES</div>
                    <Stack>
                        {arrStepShow !== undefined ? arrStepShow.map((item) => <ShowStepItemStack value={"(" + item.u + ", " + item.v + ")"} />) : ""}
                    </Stack>
                </Col>
                <Col xs={4}>
                    <div className="text-white d-flex justify-content-around fw-bold" style={{ fontSize: "0.7rem" }} >MIN EDGE</div>
                    <Stack>
                        <ShowStepItemStack value={minEdgeShow === undefined ? "" : ("(" + minEdgeShow.u + ", " + minEdgeShow.v + ")")} />
                    </Stack>
                </Col>
                <Col xs={12}>
                    <ShowStepItemStack value={minValue} />
                </Col>
            </Row> : ""}
            {algorithm === "ChuLiu" ? <Row>
                <div className="w-100 mb-2">
                    <MyButton value="Run" handleFunction={runChuLiu} />
                </div>
            </Row> : ""}


        </Container>
    );
}

export default ShowStep;
