import styles from "./MyButton.module.scss"
import clsx from "clsx";
function MyButton({ value, handleFunction, selected }) {
    return (
        <button className={clsx(styles.myBtn, selected ? styles.selected : "")} onClick={handleFunction}>
            {value}
        </button>
    );
}

export default MyButton;
