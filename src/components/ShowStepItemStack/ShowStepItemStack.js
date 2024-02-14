import { Col, Container, Row } from "react-bootstrap";
import styles from "./ShowStepItemStack.module.scss"
import clsx from "clsx";

function ShowStepItemStack({ value }) {
    return (
        <div className={clsx(styles.stackItem)}>
            {value}
        </div>
    );
}

export default ShowStepItemStack;
