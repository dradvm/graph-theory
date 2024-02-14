import styles from "./App.module.scss"
import clsx from "clsx";
import { Col, Container, Row, Stack } from "react-bootstrap";
import CommandArea from "@components/CommandArea/CommandArea";
import ShowStep from "@components/ShowStep/ShowStep";
import { createContext, useEffect, useRef, useState } from "react";
import GraphContainer from "@components/GraphContainer/GraphContainer";
import NavTop from "@components/NavTop/NavTop";

const GraphContext = createContext()


function App() {
  const refContainerGraphContainer = useRef();
  const refHeightScreen = useRef();
  const [dataGraph, setDataGraph] = useState({ n: null, points: [], edges: [], matrix: [] })
  const [modeDirected, setModeDirected] = useState(false)
  const [modePath, setModePath] = useState(false)
  const [algorithm, setAlgorithm] = useState(null)
  const stateTime = {
    SuperSlow: 5000,
    Slow: 3000,
    Normal: 1000,
    Fast: 500,
    SuperFast: 200
  }
  const [time, setTime] = useState(stateTime.Normal)
  const [dimensionsGraphContainer, setDimensionsGraphContainer] = useState({
    width: 0,
    height: 0,
  });

  const [points, setPoints] = useState([])
  const [edges, setEdges] = useState([])
  const state = {
    idle: "#ccc",
    pending: "red",
    marked: "green",
  }
  const handlePointsSetPosition = (e, point) => {
    setPoints(points.map((item) => {
      return {
        ...item,
        position: item.value === point.value ? point.position : item.position
      }
    }))
  }

  const findItem = (value) => {
    return points.filter((item) => item.value === value)[0]
  }


  useEffect(() => {
    const element = refContainerGraphContainer.current;
    const elementHeight = refHeightScreen.current;
    const handleResize = () => {
      const newHeight = elementHeight.offsetHeight;
      const newWidth = element.offsetWidth;
      setDimensionsGraphContainer({
        width: newWidth,
        height: newHeight
      })
    };
    handleResize()
    // Bắt đầu theo dõi sự thay đổi kích thước của cả window
    window.addEventListener('resize', handleResize);

    // Cleanup khi component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <GraphContext.Provider value={{
      time, setTime, stateTime,
      state,
      dataGraph, setDataGraph,
      points, setPoints,
      edges, setEdges,
      handlePointsSetPosition,
      findItem,
      modeDirected, setModeDirected,
      modePath, setModePath,
      algorithm, setAlgorithm
    }}>
      <Container fluid className={clsx("w-100 vh-100 position-fixed", styles.app)} ref={refHeightScreen}>
        <Row className="h-100">
          <Col xs={9} className="text-white" ref={refContainerGraphContainer}>
            <GraphContainer dimensions={dimensionsGraphContainer} />
          </Col>
          <Col xs={3}>
            <div className="d-flex flex-column justify-content-between h-100">
              <NavTop />
              <ShowStep />
              <CommandArea />
            </div>
          </Col>
        </Row>
      </Container>
    </GraphContext.Provider>

  );
}

export default App;
export { GraphContext }