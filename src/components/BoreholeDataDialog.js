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
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
  withStyles,
} from "@material-ui/core";
import React from "react";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import clsx from "clsx";
import { ScaleRuller } from "./ScaleRuller";

const TableFieldNameCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.grey[50],
    color: theme.palette.common.black,
    fontWeight: 600,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

export const BoreholeViewerDialog = ({ dialogInfo, onClose }) => {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scale, setScale] = React.useState(30);
  const [sumOfThickness, setSumOfThickness] = React.useState(0);
  const [boreholeDataCount, setBoreholeDataCount] = React.useState(0);
  const [currentItem, setCurrentItem] = React.useState(null);
  const [thick_values, setThick_values] = React.useState([]);
  const [isMetaEditMode, setMetaEditMode] = React.useState(false);
  const getStrataName = (thick_value) =>
    dialogInfo.strataNameDatas.find((e) => e.id === thick_value.thick_id).name;

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [dialogInfo]);

  React.useEffect(() => {
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
          thick_id: culumnName,
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
      thick_values.reduce((prev, next) => prev + next.thick, 0),
    );
  }, [dialogInfo, selectedIndex]);

  return (
    <Dialog
      role="dialog"
      open={dialogInfo.isVisiable}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        <Toolbar>
          <Typography variant="h6" component="h2" role="title">
            시추데이터 조회
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
          <Table aria-label="simple table">
            <TableBody>
              <TableRow>
                <TableFieldNameCell variant="head">이름</TableFieldNameCell>
                <TableCell>
                  {isMetaEditMode ? (
                    <TextField value={currentItem?.name} />
                  ) : (
                    currentItem?.name
                  )}
                </TableCell>
                <TableFieldNameCell variant="head">
                  지반 표고 (Meter)
                </TableFieldNameCell>
                <TableCell>
                  {isMetaEditMode ? (
                    <TextField value={currentItem?.elevation} />
                  ) : (
                    currentItem?.elevation
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableFieldNameCell variant="head">
                  Easting (X)
                </TableFieldNameCell>
                <TableCell>
                  {isMetaEditMode ? (
                    <TextField value={currentItem?.easting} />
                  ) : (
                    Number(currentItem?.easting || 0).toLocaleString()
                  )}
                </TableCell>
                <TableFieldNameCell variant="head">
                  Northing (Y)
                </TableFieldNameCell>
                <TableCell>
                  {isMetaEditMode ? (
                    <TextField value={currentItem?.northing} />
                  ) : (
                    Number(currentItem?.northing || 0).toLocaleString()
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>
                  <div style={{ display: "flex" }}>
                    <div style={{ flexGrow: 1 }} />
                    <Button
                      onClick={() => {
                        setMetaEditMode(!isMetaEditMode);
                      }}
                    >
                      {isMetaEditMode ? "적용" : "수정"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
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
                  <TableCell
                    className={clsx(
                      classes.middleCenter,
                      classes.fontEffect,
                      idx === 0 && classes.backColor0,
                      idx === 1 && classes.backColor1,
                      idx === 2 && classes.backColor2,
                      idx === 3 && classes.backColor3,
                      idx === 4 && classes.backColor4,
                      idx === 5 && classes.backColor5,
                      idx === 6 && classes.backColor6,
                      idx === 7 && classes.backColor7,
                      idx === 8 && classes.backColor8,
                      idx === 9 && classes.backColor9,
                    )}
                  >
                    {getStrataName(thick_value)}
                  </TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              ))}
              {thick_values && thick_values.length > 0 ? (
                <TableRow className={classes.thickRow}>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
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
            Scale
          </Typography>
          <Slider
            defaultValue={30}
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
  middleCenter: {
    verticalAlign: "middle",
    textAlign: "center",
  },
  fontEffect: {
    fontWeight: 600,
  },
  backColor0: {
    backgroundColor: "brown",
  },
  backColor1: {
    backgroundColor: "DarkGoldenRod",
  },
  backColor2: {
    backgroundColor: "Olive",
  },
  backColor3: {
    backgroundColor: "RosyBrown",
  },
  backColor4: {
    backgroundColor: "DarkBlue",
  },
  backColor5: {
    backgroundColor: "DarkMagenta",
  },
  backColor6: {
    backgroundColor: "DarkKhaki",
  },
  backColor7: {
    backgroundColor: "DarkOrange",
  },
  backColor8: {
    backgroundColor: "DarkSeaGreen",
  },
  backColor9: {
    backgroundColor: "DarkSlateGrey",
  },
}));
