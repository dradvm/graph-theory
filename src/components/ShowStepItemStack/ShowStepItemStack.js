import { Col, Container, Row } from "react-bootstrap";
import styles from "./ShowStepItemStack.module.scss"
import clsx from "clsx";

function ShowStepItemStack({ value, state }) {
    return (
        <div className={clsx(styles.stackItem, state ? styles.marked : "")}>
            {value}
        </div>
    );
}

export default ShowStepItemStack;
