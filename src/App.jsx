import { useEffect, useRef, useState } from "react";
import Tree from "react-d3-tree";
import { getFullTree } from "./utils";

// This is a simplified example of an org chart with a depth of 2.
// Note how deeper levels are defined recursively via the `children` property.

export default function OrgChartTree() {
  const treeContainer = useRef(null);
  const [depthFactor, setDepthFactor] = useState(200);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState();

  useEffect(() => {
    if (treeContainer.current) {
      setDimensions({
        width: treeContainer.current.clientWidth,
        height: treeContainer.current.clientHeight,
      });
    }
  }, [treeContainer]);

  useEffect(() => {
    setIsLoading(true);
    getFullTree().then((data) => {
      setData(data);
      setIsLoading(false);
    });
  }, []);
  if (isLoading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  return (
    <div
      ref={treeContainer}
      id="treeWrapper"
      style={{ width: "100svw", height: "100svh", position: "relative" }}
    >
      <div
        style={{
          position: "absolute",
          top: "0",
          right: "0",
          backgroundColor: "rgba(0,0,0,0.5)",
          padding: "20px",
        }}
      >
        <label htmlFor="depthFactor">Độ sâu của cây</label>
        <input
          id="depthFactor"
          type="number"
          value={depthFactor}
          onChange={(e) => setDepthFactor(e.target.value)}
        />
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          <button
            onClick={() => {
              setDepthFactor(200);
            }}
            className="button-1"
          >
            200
          </button>
          <button
            onClick={() => {
              setDepthFactor(500);
            }}
            className="button-1"
          >
            500
          </button>
          <button
            onClick={() => {
              setDepthFactor(1000);
            }}
            className="button-1"
          >
            1000
          </button>
          <button
            onClick={() => {
              setDepthFactor(1500);
            }}
            className="button-1"
          >
            1500
          </button>
        </div>
      </div>
      <Tree
        data={data}
        pathFunc="step"
        dimensions={dimensions}
        depthFactor={depthFactor}
        initialDepth={1}
      />
    </div>
  );
}
