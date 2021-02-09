import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  Paper,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { createRef, useEffect, useState } from "react";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

export const BoreholeViewerDialog = ({ dialogInfo, onClose }) => {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scale, setScale] = useState(30);
  const [sumOfThickness, setSumOfThickness] = useState(0);
  const [boreholeDataCount, setBoreholeDataCount] = useState(0);
  const [currentItem, setCurrentItem] = useState(null);
  const [thick_values, setThick_values] = useState([]);
  useEffect(() => {
    setSelectedIndex(0);
  }, [dialogInfo]);

  useEffect(() => {
    setBoreholeDataCount(dialogInfo?.boreholeData?.length || 0);

    const currentItem =
      dialogInfo.boreholeData && dialogInfo?.boreholeData[selectedIndex];
    setCurrentItem(currentItem);
    const value_array = ["thick_1", "thick_2", "thick_3", "thick_4", "thick_5"];
    const thick_values = [];

    value_array.map((culumnName) => {
      const current_tick = currentItem ? Number(currentItem[culumnName]) : 0;
      const before_tick_value =
        thick_values.length > 0 ? thick_values[thick_values.length - 1] : null;
      currentItem &&
        currentItem[culumnName] &&
        thick_values.push({
          elevation:
            thick_values.length > 0
              ? before_tick_value.elevation - current_tick
              : Number(currentItem.elevation) - current_tick,
          depth:
            thick_values.length > 0
              ? before_tick_value.depth + current_tick
              : current_tick,
          thick: current_tick,
        });
      return true;
    });
    setThick_values(thick_values);
    setSumOfThickness(
      thick_values.reduce(function (prev, next) {
        return prev + next.thick;
      }, 0)
    );
  }, [dialogInfo, selectedIndex]);

  return (
    <Dialog
      open={dialogInfo.isVisiable}
      onClose={onClose}
      fullWidth={true}
      maxWidth={"md"}
    >
      <DialogTitle>
        <Toolbar>
          <Typography variant="h6" component="h2">
            시추데이터 조회 || 시추데이터 수정
          </Typography>
          <div style={{ flexGrow: 1 }} />
          <div style={{ margin: "0 8px" }}>
            <Typography>
              {boreholeDataCount} 개 중 {Number(selectedIndex) + 1} 번
            </Typography>
          </div>

          <div style={{ margin: "0 8px" }}>
            <IconButton
              onClick={() => {
                setSelectedIndex(Number(selectedIndex) - 1);
              }}
              disabled={Number(selectedIndex) === 0}
            >
              <NavigateBeforeIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                setSelectedIndex(Number(selectedIndex) + 1);
              }}
              disabled={Number(selectedIndex) + 1 === boreholeDataCount}
            >
              <NavigateNextIcon />
            </IconButton>
          </div>
        </Toolbar>
      </DialogTitle>
      <DialogContent>
        <TableContainer className={classes.container} component={Paper}>
          <Table>
            <TableRow>
              <TableCell variant="head">이름</TableCell>
              <TableCell>{currentItem?.name}</TableCell>
              <TableCell variant="head">지반표고</TableCell>
              <TableCell>{currentItem?.elevation}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">Easting (X)</TableCell>
              <TableCell>{currentItem?.easting}</TableCell>
              <TableCell variant="head">Northing (Y)</TableCell>
              <TableCell>{currentItem?.northing}</TableCell>
            </TableRow>
          </Table>
        </TableContainer>
        <TableContainer className={classes.container} component={Paper}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead className={classes.boreholeTableHead}>
              <TableRow>
                <TableCell
                  variant="head"
                  style={{ width: 60, textAlign: "center", padding: 0 }}
                >
                  표고
                  <br />
                  Elev.
                  <br />
                  Meter
                </TableCell>
                <TableCell
                  variant="head"
                  style={{ width: 60, textAlign: "center", padding: 0 }}
                >
                  스케일
                  <br />
                  Scale
                  <br />
                  Meter
                </TableCell>
                <TableCell
                  variant="head"
                  style={{ width: 60, textAlign: "center", padding: 0 }}
                >
                  심도
                  <br />
                  Depth
                  <br />
                  Meter
                </TableCell>
                <TableCell
                  variant="head"
                  style={{ width: 60, textAlign: "center", padding: 0 }}
                >
                  층후
                  <br />
                  Thickness
                  <br />
                  Meter
                </TableCell>
                <TableCell
                  variant="head"
                  style={{ width: 100, textAlign: "center", padding: 0 }}
                >
                  지층명
                </TableCell>
                <TableCell
                  variant="head"
                  style={{ textAlign: "center", padding: 0 }}
                >
                  비고
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={classes.boreholeTableBody}>
              {thick_values.map((thick_value, idx) => (
                <TableRow
                  key={idx}
                  className={classes.thickRow}
                  style={{
                    height: `${thick_value.thick * scale}px`,
                    overflow: "hidden",
                  }}
                >
                  <TableCell className={classes.bottomCenter}>
                    {thick_value.elevation.toFixed(2)}
                  </TableCell>
                  {idx === 0 ? (
                    <TableCell rowSpan={thick_values.length + 1}>
                      <ScaleRuller
                        scale={scale}
                        sumOfThickness={sumOfThickness + 5}
                        width={60}
                      />
                    </TableCell>
                  ) : (
                    <></>
                  )}
                  <TableCell className={classes.bottomCenter}>
                    {thick_value.depth.toFixed(2)}
                  </TableCell>
                  <TableCell className={classes.bottomCenter}>
                    {thick_value.thick.toFixed(2)}
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              ))}
              {thick_values && thick_values.length > 0 ? (
                <TableRow className={classes.thickRow}>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell style={{ verticalAlign: "top" }}>
                    심도{" "}
                    {thick_values[thick_values.length - 1].depth.toFixed(2)} M
                    에서 시추종료
                  </TableCell>
                </TableRow>
              ) : (
                <></>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <div style={{ flexGrow: 1, width: 40, padding: "0 16px" }}>
          <Typography id="discrete-slider" gutterBottom>
            Scale{" "}
          </Typography>
          <Slider
            defaultValue={scale}
            getAriaValueText={(value) => `1 Meter : ${value} pixels`}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={10}
            marks
            min={30}
            max={100}
            onChange={(e, newValue) => {
              setScale(newValue);
            }}
          />
        </div>

        <div style={{ flexGrow: 1 }} />
        <Button>취소</Button>
        <Button>저장</Button>
      </DialogActions>
    </Dialog>
  );
};
const useStyles = makeStyles((theme) => ({
  container: {
    margin: theme.spacing(2, 0),
    maxHeight: 600,
  },
  thickRow: {
    "&>.MuiTableCell-body": {
      padding: 0,
      border: "1px solid #eee",
      borderSpacing: "0",
      borderCollapse: "collapse",
    },
  },
  boreholeTableHead: {
    "&>*": {
      padding: 0,
    },
  },
  boreholeTableBody: {
    "&>*": {
      padding: 0,
    },
  },
  bottomCenter: {
    verticalAlign: "bottom",
    textAlign: "center",
  },
}));
const ScaleRuller = ({ scale, sumOfThickness, width = 100 }) => {
  const height = sumOfThickness * scale;

  const canvasRef = createRef();

  // round pixelRatio, because older devices have a pixelRatio of 1.5. Treat them as @2x devices
  let pixelRatio = Math.round(window.devicePixelRatio) || 1;
  const collectedWidth = width * pixelRatio;
  const collectedHeight = height * pixelRatio;
  console.log(`pixelRatio: ${pixelRatio}`);
  useEffect(() => {
    /**
     * @type {HTMLCanvasElement}
     */
    const canvas = canvasRef.current;
    canvasRef.current.width = collectedWidth;
    canvasRef.current.height = collectedHeight;
    canvas.style.width = Math.round(collectedWidth / pixelRatio) + "px";
    canvas.style.height = Math.round(collectedHeight / pixelRatio) + "px";
    /**
     * @type {CanvasRenderingContext2D}
     */
    const ctx = canvas.getContext("2d");
    ctx.scale(pixelRatio, pixelRatio);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;

    for (let currentY = 0; currentY <= height; currentY += scale / 5) {
      ctx.beginPath();

      if (currentY % scale < 0.01) {
        ctx.moveTo(width - 20.5, currentY - 0.5);
      } else {
        ctx.moveTo(width - 10.5, currentY - 0.5);
      }
      ctx.lineTo(width, currentY - 0.5);
      ctx.stroke();
    }
  }, [
    canvasRef,
    collectedHeight,
    collectedWidth,
    height,
    pixelRatio,
    scale,
    sumOfThickness,
    width,
  ]);

  return <canvas ref={canvasRef} width={width} height={height}></canvas>;
};