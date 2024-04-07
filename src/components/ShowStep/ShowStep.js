import { Col, Container, Row, Stack } from "react-bootstrap";
import ShowStepItemStack from "@/components/ShowStepItemStack/ShowStepItemStack";
import { useContext, useEffect, useState } from "react";
import { GraphContext } from "@/App";
import MyButton from "../MyButton/MyButton";
import clsx from "clsx";
import styles from "./ShowStep.module.scss"
function ShowStep() {
    const { dataGraph, setDataGraph, points, setPoints, state, algorithm, time, edges, setEdges, dimensionsGraphContainer, modeDirected } = useContext(GraphContext)
    const [arrStepList] = useState([])
    const [arrStepList2] = useState([])
    const [arrStepList3] = useState([])
    const [markedList] = useState([])
    const [timeoutList] = useState([])
    const [arrStepShow, setArrStepShow] = useState([])
    const [arrStepShow2, setArrStepShow2] = useState([])
    const [arrStepShow3, setArrStepShow3] = useState([])
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
        arrStepList2.push([].concat(...matrixFloyd).map((item) => item === infinity ? "NO PATH" : item))
        for (let k = 1; k <= dataGraph.n; k++) {
            for (let i = 1; i <= dataGraph.n; i++) {
                for (let j = 1; j <= dataGraph.n; j++) {
                    if (matrixFloyd[i - 1][k - 1] === infinity || matrixFloyd[k - 1][j - 1] === infinity) {
                        continue
                    }
                    if (matrixFloyd[i - 1][j - 1] > matrixFloyd[i - 1][k - 1] + matrixFloyd[k - 1][j - 1]) {
                        const temp = Array.from(matrixFloyd.map((item) => Array.from(item)))
                        temp[i - 1][j - 1] = matrixFloyd[i - 1][k - 1] + " + " + matrixFloyd[k - 1][j - 1] + " < " + (matrixFloyd[i - 1][j - 1] === infinity ? "\u221E" : matrixFloyd[i - 1][j - 1])

                        arrStepList2.push([].concat(...temp).map((item) => item === infinity ? "NO PATH" : item))
                        matrixFloyd[i - 1][j - 1] = matrixFloyd[i - 1][k - 1] + matrixFloyd[k - 1][j - 1]
                    }
                }
            }
        }

        arrStepList2.push([].concat(...matrixFloyd).map((item) => item === infinity ? "NO PATH" : item))
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
        for (let i = 0; i < arrStepList2.length; i++) {
            timeoutId = setTimeout(() => {
                setArrStepShow2(arrStepList2[i])
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
                    console.log(arrTemp)
                    setEdges(edges.map((edge) => {
                        var newState = state.idle
                        arrTemp.forEach((temp) => {
                            if (modeDirected) {
                                if (edge.u === temp[0] && edge.v === temp[1]) {
                                    newState = state.pending
                                }
                            }
                            else {
                                if (edge.u === temp[0] && edge.v === temp[1]) {
                                    newState = state.pending
                                }
                                if (edge.u === temp[1] && edge.v === temp[0]) {
                                    newState = state.pending
                                }
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
                setArrStepShow3(arrEdgeState)
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

        var arrEd = []
        arrEdgeList.push(Array.from(arrEd))
        for (let i = 1; i < rank; i++) {
            var arrP = []
            marked.forEach((item, index) => {
                if (item === i) {
                    if (item === 1 || item === rank - 1) {
                        arrP.push(index + 1)
                        if (index + 1 === dataGraph.n) {
                            path[path.length - 1].forEach((item2) => {
                                if (dataGraph.matrix[item2][index + 1]) {
                                    arrEd.push(edges.find((ed) => ed.u === item2 && ed.v === (index + 1)))
                                    arrEdgeList.push(Array.from(arrEd))
                                }
                            })
                        }

                    }
                    else if (T[index] === t[index]) {
                        var check = false
                        console.log(index + 1)
                        path[path.length - 1].forEach((item2) => {
                            if (dataGraph.matrix[item2][index + 1]) {
                                check = true
                                arrEd.push(edges.find((ed) => ed.u === item2 && ed.v === (index + 1)))
                                arrEdgeList.push(Array.from(arrEd))
                            }
                        })
                        if (check) {
                            arrP.push(index + 1)
                        }
                    }
                }
            })
            if (arrP.length > 0) {
                path.push(arrP)
            }
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
                newPointPosition = points.map((item) => {
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
                })
                setPoints(newPointPosition)
            }, time * i)
            timeoutList.push(timeoutId)
        }

        for (let i = 0; i < arrEdgeList.length; i++) {
            timeoutId = setTimeout(() => {
                var newPointEdge = Array.from(new Set(arrEdgeList[i].reduce((arr, item) => arr.concat(item.u, item.v), [])))
                console.log(newPointEdge)
                setPoints(Array.from(newPointPosition).map((item) => {
                    var newState = state.idle
                    if (newPointEdge !== undefined) {
                        if (newPointEdge.indexOf(item.value) > -1) {
                            newState = state.marked
                        }
                    }
                    return {
                        ...item,
                        state: newState
                    }
                }))
                setEdges(edges.map((item) => {
                    var newState = state.idle;
                    if (arrEdgeList[i].indexOf(item) > -1) {
                        newState = state.marked
                        console.log("A")
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
                setArrStepShow3(arrStepList[i])
                setMinEdgeShow(minEdgeList[i])
            }, time * i)
            timeoutList.push(timeoutId)
        }
    }

    const buildH = (G) => {
        var H = []
        var point = Array.from(new Set(G.edges.reduce((arr, item) => arr.concat([item.u, item.v]), [])))
        point.sort()
        var HShow = []
        var HShow2 = []
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
                HShow2.push(edge)
            }
        }
        HShow = G.edges.map((item) => {

            return {
                ...item,
                state: H.indexOf(item) > -1 ? state.marked : state.pending
            }
        })
        arrStepList.push({ points: point, edges: HShow })
        arrStepList.push({ points: point, edges: HShow2 })
        return { points: point, edges: H }
    }

    const isCycle = (H) => {
        var point = Array.from(new Set(H.edges.reduce((arr, item) => arr.concat([item.u, item.v]), [])))

        point.sort()
        var bplt = []
        var k = 1
        var numChuLui = Array(point.length).fill(0)
        var minNumChuLui = Array(point.length).fill(0)
        var stackChuLui = []
        var dataGraphHMatrix = []
        for (let i = 0; i < point.length; i++) {
            var row = []
            for (let j = 0; j < point.length; j++) {
                row.push(0)
            }
            dataGraphHMatrix.push(row)
        }
        H.edges.forEach((item) => {
            dataGraphHMatrix[point.indexOf(item.u)][point.indexOf(item.v)] = item.w
        })
        function SCC(num) {
            stackChuLui.push(num)
            numChuLui[num] = k
            minNumChuLui[num] = k
            k++
            for (let i = 0; i < point.length; i++) {
                if (dataGraphHMatrix[num][i] !== 0) {
                    if (numChuLui[i] === 0) {
                        SCC(i)
                        var num1 = minNumChuLui[num]
                        var num2 = minNumChuLui[i]
                        minNumChuLui[num] = Math.min(num1, num2)
                    }
                    else if (stackChuLui.indexOf(i) > -1) {
                        var num1 = minNumChuLui[num]
                        var num2 = numChuLui[i]
                        minNumChuLui[num] = Math.min(num1, num2)
                    }
                }
            }
            if (numChuLui[num] === minNumChuLui[num]) {
                var x
                var strongConnect = []
                do {
                    x = stackChuLui.pop()
                    strongConnect.push(point[x])

                } while (x != num)
                bplt.push(strongConnect)
            }
        }
        for (let i = 0; i < point.length; i++) {
            if (numChuLui[i] === 0) {
                SCC(i)
            }
        }
        return bplt.length < point.length;
    }
    const contract = (G, H) => {
        var point = Array.from(new Set(G.edges.reduce((arr, item) => arr.concat([item.u, item.v]), [])))

        point.sort()
        var bplt = []
        var k = 1
        var numChuLui = Array(point.length).fill(0)
        var minNumChuLui = Array(point.length).fill(0)
        var stackChuLui = []
        var dataGraphHMatrix = []
        for (let i = 0; i < point.length; i++) {
            var row = []
            for (let j = 0; j < point.length; j++) {
                row.push(0)
            }
            dataGraphHMatrix.push(row)
        }
        H.edges.forEach((item) => {
            dataGraphHMatrix[point.indexOf(item.u)][point.indexOf(item.v)] = item.w
        })
        function SCC(num) {
            stackChuLui.push(num)
            numChuLui[num] = k
            minNumChuLui[num] = k
            k++
            for (let i = 0; i < point.length; i++) {
                if (dataGraphHMatrix[num][i] !== 0) {
                    if (numChuLui[i] === 0) {
                        SCC(i)
                        var num1 = minNumChuLui[num]
                        var num2 = minNumChuLui[i]
                        minNumChuLui[num] = Math.min(num1, num2)
                    }
                    else if (stackChuLui.indexOf(i) > -1) {
                        var num1 = minNumChuLui[num]
                        var num2 = numChuLui[i]
                        minNumChuLui[num] = Math.min(num1, num2)
                    }
                }
            }
            if (numChuLui[num] === minNumChuLui[num]) {
                var x
                var strongConnect = []
                do {
                    x = stackChuLui.pop()
                    strongConnect.push(point[x])

                } while (x != num)
                strongConnect.sort()
                bplt.push(strongConnect)
            }
        }
        for (let i = 0; i < point.length; i++) {
            if (numChuLui[i] === 0) {
                SCC(i)
            }
        }
        bplt.sort()
        console.log(bplt)
        var edgeG1 = []
        G.edges.forEach((item) => {
            var u = bplt.find((bp) => bp.indexOf(item.u) > -1)
            var v = bplt.find((bp) => bp.indexOf(item.v) > -1)
            if (u !== v) {
                var edge = H.edges.find((edge) => edge.v === item.v)
                var w = item.w
                if (edge !== undefined && v.length > 1) {
                    w -= edge.w
                }
                edgeG1.push({ u, v, w, state: state.idle, linkU: item.u, linkV: item.v })
            }
        })
        edgeG1.sort()
        return { points: bplt, edges: edgeG1 }
    }
    const expand = (H1, H, G1) => {
        var pointH1 = Array.from(new Set(H1.edges.reduce((arr, item) => arr.concat([item.linkU, item.linkV]), [])))
        var pointH = Array.from(new Set(H.edges.reduce((arr, item) => arr.concat([item.u, item.v]), [])))

        H1.edges.forEach((edgeH1) => {
            var preU = edgeH1.linkU
            var preV = edgeH1.linkV
            var edgeG1 = G1.edges.find((item) => item.u === preU && item.v === preV)
            var edgeH1 = H.edges.find((item) => item.u === preU && item.v === preV)
            if (edgeH1 === undefined) {
                H.edges.push(edgeG1)
                var edgeH = H.edges.find((item) => item.v === edgeG1.v)
                if (edgeH !== undefined) {
                    H.edges = H.edges.filter((item) => item !== edgeH)
                }
            }
        })        
        console.log("--")

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
            arrStepList.push(G[t])
        }
        while (t > 0) {
            expand(H[t], H[t - 1], G[t - 1])
            console.log(H[t])
            arrStepList2.push(H[t])
            t--
        }
        console.log(H[0])
        arrStepList2.push(H[0])
    }
    const runChuLiu = () => {
        resetAllData()
        chuLiu()
        showChuLiu()
    }
    const showChuLiu = () => {
        var arrGraphG = [{ points: points, edges: edges }]
        var arrGraphDataPointPosH = [{ points: points, edges: edges }]
        const d = dimensionsGraphContainer
        const size = 200
        var pointsNew = points
        console.log(arrStepList)
        console.log(arrStepList2)
        if (points.length !== dataGraph.n || edges.length !== dataGraph.edges.length) {
            return
        }
        for (let i = 0; i < arrStepList.length; i++) {
            var listPoint = arrStepList[i].points
            if (pointsNew.length !== listPoint.length) {
                var pointsNew = listPoint.map((item) => {
                    var posX = 0
                    var posY = 0
                    if (Array.isArray(item)) {
                        item.forEach((item2) => {
                            var ps = pointsNew.find((p) => p.value === item2).position
                            posX += ps.x
                            posY += ps.y
                        })
                        posX /= item.length
                        posY /= item.length
                    }
                    else {
                        return pointsNew.find((p) => p.value === item)
                    }
                    return {
                        value: item,
                        position: {
                            x: posX,
                            y: posY
                        },
                        secondText: undefined,
                        state: state.idle
                    }
                })
                arrGraphDataPointPosH.push({ points: pointsNew, edges: arrStepList[i].edges })
            }
            arrGraphG.push({ points: pointsNew, edges: arrStepList[i].edges })
        }
        var arrGraphH = []
        for (let i = 0; i < arrStepList2.length; i++) {
            var listPoint = arrStepList2[i].points
            var pointsNew = listPoint.map((item) => {
                var po = arrGraphDataPointPosH[arrStepList2.length - 1 - i].points.find((arrG) => item === arrG.value)
                return {
                    ...po
                }
            })
            arrGraphH.push({ points: pointsNew, edges: arrStepList2[i].edges })
        }
        var arrGraph = [].concat(arrGraphG, arrGraphH)
        for (let i = 0; i < arrGraph.length; i++) {
            var timeoutId = setTimeout(() => {
                setPoints(arrGraph[i].points)
                setEdges(arrGraph[i].edges)
            }, time * i)
            timeoutList.push(timeoutId)
        }
    }
    const edmondsKarp = () => {

        var F = []
        for (let i = 0; i <= dataGraph.n; i++) {
            F.push(Array(dataGraph.n + 1).fill(0))
        }
        do {
            var label = []
            for (let i = 0; i <= dataGraph.n; i++) {
                label.push({
                    direction: 0,
                    parent: -1,
                    sigma: undefined
                })
            }
            label[1].direction = 1;
            label[1].parent = 1;
            label[1].sigma = infinity
            var queue = []
            var found = false
            var sigma = 0
            queue.push(1)
            var arrStep = []
            var arrStep2 = []
            arrStepList.push(Array.from(arrStep))
            arrStepList2.push(Array.from(arrStep2))
            arrStepList3.push(Array.from(label.map((item) => Object.assign({}, item))))
            arrEdgeList.push(Array.from(F.map((item) => Array.from(item))))
            while (queue.length > 0) {
                var u = queue.shift()
                for (let i = 1; i <= dataGraph.n; i++) {
                    if (dataGraph.matrix[u][i] && label[i].direction === 0) {
                        if (F[u][i] < dataGraph.matrix[u][i]) {
                            label[i].direction = 1
                            label[i].parent = u
                            label[i].sigma = Math.min(label[u].sigma, dataGraph.matrix[u][i] - F[u][i]);
                            queue.push(i)
                            arrStep.push(edges.find((ed) => ed.u === u && ed.v === i))
                            arrStepList.push(Array.from(arrStep))
                            arrStepList2.push(Array.from(arrStep2))
                            arrStepList3.push(Array.from(label.map((item) => Object.assign({}, item))))
                            arrEdgeList.push(Array.from(F.map((item) => Array.from(item))))
                        }
                    }
                }
                for (let i = 1; i <= dataGraph.n; i++) {
                    if (dataGraph.matrix[i][u] && label[i].direction === 0) {
                        if (F[i][u] > 0) {
                            label[i].direction = -1
                            label[i].parent = u
                            label[i].sigma = Math.min(label[u].sigma, F[i][u])
                            queue.push(i)
                            arrStep.push(edges.find((ed) => ed.u === i && ed.v === u))
                            arrStepList.push(Array.from(arrStep))
                            arrStepList2.push(Array.from(arrStep2))
                            arrStepList3.push(Array.from(label.map((item) => Object.assign({}, item))))
                            arrEdgeList.push(Array.from(F.map((item) => Array.from(item))))
                        }
                    }
                }
                if (label[dataGraph.n].direction !== 0) {
                    found = true
                    break
                }
            }
            if (found) {
                sigma = label[dataGraph.n].sigma
                var u = dataGraph.n
                arrStepList.push(arrStep)
                arrStepList2.push(Array.from(arrStep2))
                arrStepList3.push(Array.from(label.map((item) => Object.assign({}, item))))
                arrEdgeList.push(Array.from(F.map((item) => Array.from(item))))
                while (u !== 1) {
                    var p = label[u].parent
                    if (label[u].direction > 0) {
                        F[p][u] += sigma
                        arrStep2.push(edges.find((item) => item.u === p && item.v === u))
                    }
                    else {
                        F[u][p] -= sigma
                        arrStep2.push(edges.find((item) => item.u === u && item.v === p))
                    }
                    u = p
                    arrStepList.push(arrStep)
                    arrStepList2.push(Array.from(arrStep2))
                    arrStepList3.push(Array.from(label.map((item) => Object.assign({}, item))))
                    arrEdgeList.push(Array.from(F.map((item) => Array.from(item))))
                }
            }
            else {
                arrStepList.push(arrStep)
                arrStepList2.push(Array.from(arrStep2))
                arrStepList3.push(Array.from(label.map((item) => Object.assign({}, item))))
                arrEdgeList.push(Array.from(F.map((item) => Array.from(item))))
                break
            }
        } while (true)
    }
    const runEdmondsKarp = () => {
        resetAll()
        edmondsKarp()
        showEdmondsKarp()
    }
    const showEdmondsKarp = () => {
        var timeoutId
        for (let i = 0; i < arrStepList.length; i++) {
            timeoutId = setTimeout(() => {
                var newPoint = Array.from(new Set((arrStepList[i].reduce((arr, ed) => arr.concat(ed.u, ed.v), []))))
                var newPoint2 = Array.from(new Set((arrStepList2[i].reduce((arr, ed) => arr.concat(ed.u, ed.v), []))))
                setPoints(points.map((item) => {
                    var newState = state.idle
                    if (newPoint !== undefined) {
                        if (newPoint.indexOf(item.value) > -1) {
                            newState = state.pending
                        }
                        if (newPoint2.indexOf(item.value) > -1) {
                            newState = state.marked
                        }
                        if (i === arrStepList.length - 1) {
                            if (newPoint.indexOf(item.value) > -1) {
                                newState = state.pending
                            }
                            else {
                                newState = state.marked
                            }
                        }
                    }
                    return {
                        ...item,
                        secondText: arrStepList3[i][item.value].direction + " " + arrStepList3[i][item.value].parent + " " + arrStepList3[i][item.value].sigma,
                        state: newState
                    }
                }))
                setEdges(edges.map((item) => {
                    var newState = state.idle
                    if (arrStepList[i].indexOf(item) > -1) {
                        newState = state.pending
                    }
                    if (arrStepList2[i].indexOf(item) > -1) {
                        newState = state.marked
                    }
                    if (i === arrStepList.length - 1) {
                        newState = state.idle
                    }
                    return {
                        ...item,
                        secondText: arrEdgeList[i][item.u][item.v],
                        state: newState
                    }
                }))
            }, i * time)
            timeoutList.push(timeoutId)
        }
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
        timeoutList.forEach((timeoutId) => {
            clearTimeout(timeoutId)
        })
        timeoutList.splice(0)
        arrStepList.splice(0)
        arrStepList2.splice(0)
        arrStepList3.splice(0)
        markedList.splice(0)
        minNumTarjanList.splice(0)
        parentNumList.splice(0)
        piNumList.splice(0)
        stack.splice(0)
        if (arrStepShow !== undefined) {
            arrStepShow.splice(0)
        }
        if (arrStepShow2 !== undefined) {
            arrStepShow2.splice(0)
        }
        if (arrStepShow3 !== undefined) {
            arrStepShow3.splice(0)
        }
        markedShow.splice(0)
        minNumTarjanShow.splice(0)
        piNumShow.splice(0)
        parentNumShow.splice(0)
        connectedComponentList.splice(0)
        arrEdgeList.splice(0)
        minEdgeList.splice(0)
    }
    const resetAllData = () => {
        resetAll()
        if (algorithm === "ChuLiu") {
            const d = dimensionsGraphContainer
            const size = 200
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
            setEdges(dataGraph.edges.map((item) => {
                return {
                    ...item,
                    state: state.idle
                }
            }))
        }
        else {
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

    }
    useEffect(() => {
        resetAll()
        setStart(1)
        setEnd(0)
    }, [dataGraph])
    useEffect(() => {
        resetAllData()
    }, [time])
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
                        {arrStepShow2 !== undefined ? arrStepShow2.map((item) => <ShowStepItemStack value={item} />) : ""}
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
                        {arrStepShow3 !== undefined ? arrStepShow3.map((item) => <ShowStepItemStack value={"(" + item[0].u + ", " + item[0].v + ")"} state={item[1]} />) : ""}
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
                        {arrStepShow3 !== undefined ? arrStepShow3.map((item) => <ShowStepItemStack value={"(" + item.u + ", " + item.v + ")"} />) : ""}
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
            {algorithm === "Edmonds - Karp" ? <Row>
                <div className="w-100 mb-2">
                    <MyButton value="Run" handleFunction={runEdmondsKarp} />
                </div>
            </Row> : ""}

        </Container>
    );
}

export default ShowStep;
