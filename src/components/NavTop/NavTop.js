import { Col, Container, Dropdown, DropdownButton, Row, Stack } from "react-bootstrap";
import styles from "./NavTop.module.scss"
import clsx from "clsx";
import { useContext, useState } from "react";
import { GraphContext } from "@/App";

function NavTop() {
    const { algorithm, setAlgorithm, time, setTime, stateTime } = useContext(GraphContext)
    const listAlgorithm = ["None", "DFS", "BFS", "Tarjan", "Moore - Dijkstra", "Bellman - Ford", "Floyd - Warshall", "Kruskal", "Prim", "Chu-Lui/Edmonds"]

    const handleSetAlgorithm = (item) => {
        if (item === "None") {
            setAlgorithm(null)
        }
        else {
            setAlgorithm(item)
        }
    }

    const handleSetTime = (item) => {
        setTime(stateTime[item])
    }

    return (
        <Container fuild gap={0} className="d-flex">
            <Dropdown className={styles.myDropDown}>

                <Dropdown.Toggle variant="success" id="dropdown-basic" className={styles.myBtn}>
                    {algorithm === null ? "Algorithm" : algorithm}
                </Dropdown.Toggle>

                <Dropdown.Menu className={styles.menu}>
                    {listAlgorithm.map((item) => <Dropdown.Item className={clsx(styles.menuItem, algorithm === item ? "selected" : "")} onClick={() => handleSetAlgorithm(item)} >{item}</Dropdown.Item>)}

                </Dropdown.Menu>
            </Dropdown>
            <Dropdown className={clsx(styles.myDropDown, "ms-3")}>
                <Dropdown.Toggle variant="success" id="dropdown-basic" className={styles.myBtn}>
                    {Object.keys(stateTime).find((item) => stateTime[item] === time)}
                </Dropdown.Toggle>

                <Dropdown.Menu className={styles.menu}>
                    {Object.keys(stateTime).map((item) => <Dropdown.Item className={clsx(styles.menuItem, algorithm === item ? "selected" : "")} onClick={() => handleSetTime(item)} >{item}</Dropdown.Item>)}

                </Dropdown.Menu>
            </Dropdown>

        </Container>
    );
}

export default NavTop;
