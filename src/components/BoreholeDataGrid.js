import React, { createRef, useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles, Paper, Slider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const columns = [
    { field: 'id', headerName: '#', type: 'number', width: 60 },
    { field: 'name', headerName: 'Name', width: 90 },
    { field: 'easting', headerName: 'Easting', type: 'number', width: 140 },
    { field: 'northing', headerName: 'Northing', type: 'number', width: 140 },
    {
        field: 'elevation', headerName: 'Ground Eleveation', type: 'number', width: 120,
    },
    {
        field: 'thick_1',
        headerName: '층이름#1',
        type: 'number',
        width: 120,
    },
    {
        field: 'thick_2',
        headerName: '층이름#1',
        type: 'number',
        width: 120,
    },
    {
        field: 'thick_3',
        headerName: '층이름#1',
        type: 'number',
        width: 120,
    },
    {
        field: 'thick_4',
        headerName: '층이름#1',
        type: 'number',
        width: 120,
    },
    {
        field: 'thick_5',
        headerName: '층이름#1',
        type: 'number',
        width: 120,
    },
];

const rows = [
    { id: 1, name: 'BH-1', easting: 197922.5154, northing: 434655.3096, elevation: 50.17, thick_1: 0.8, thick_2: 1.2, thick_3: 6.0, thick_4: 22 },
    { id: 2, name: 'BH-2', easting: 197958.9944, northing: 434627.0276, elevation: 49.74, thick_1: 0.8, thick_2: 2.2, thick_3: 5.0, thick_4: 12 },
    { id: 3, name: 'BH-3', easting: 197975.1464, northing: 434581.0906, elevation: 49.25, thick_1: 0.7, thick_2: 2.1, thick_3: 12.2, thick_4: 7 },
    { id: 4, name: 'BH-4', easting: 197895.0414, northing: 434617.6986, elevation: 53.62, thick_1: 5.8, thick_2: 0.0, thick_3: 5.2, thick_4: 11 },

];
const defaultDialogInfo = {
    isVisiable: false,
    boreholeData: null
}

export default function BoreholeDataGrid() {
    const [dialogInfo, setDialogInfo] = React.useState(defaultDialogInfo);
    const [selection, setSelection] = React.useState([]);

    const doEditHandler = () => {

        const rows_selected = rows.filter(e => (selection.includes(`${e.id}`)));

        setDialogInfo({ ...dialogInfo, isVisiable: true, boreholeData: rows_selected });
    };



    return (
        <>
            <div style={{ height: 400, width: '100%' }}>
                <BoreholeToolbar doEdit={doEditHandler} />
                <DataGrid rows={rows} columns={columns} checkboxSelection onSelectionChange={(newSelection) => {
                    setSelection(newSelection.rowIds);
                }} />
            </div>
            <BoreholeViewerDialog dialogInfo={dialogInfo} onClose={() => (setDialogInfo({ ...dialogInfo, isVisiable: false }))} />
        </>
    );
}

const BoreholeToolbar = ({ doEdit, doExport }) => {
    return <Toolbar>
        <Button>추가</Button>
        <Button onClick={doEdit}>편집</Button>
        <Button>삭제</Button>
        <div style={{ flexGrow: 1 }} />
        <Button>불러오기</Button>
        <Button onClick={doExport && doExport()}>내보내기</Button>
    </Toolbar>;
}


const BoreholeViewerDialog = ({ dialogInfo, onClose }) => {
    const classes = useStyles();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scale, setScale] = useState(30);
    useEffect(() => {
        setSelectedIndex(0);
    }, [dialogInfo]);
    const boreholeDataCount = dialogInfo?.boreholeData?.length || 0;

    const currentItem = dialogInfo.boreholeData && dialogInfo?.boreholeData[selectedIndex];
    const value_array = ['thick_1', 'thick_2', 'thick_3', 'thick_4', 'thick_5'];
    const thick_values = [];

    value_array.map((culumnName) => {

        const current_tick = currentItem ? Number(currentItem[culumnName]) : 0;
        const before_tick_value = thick_values.length > 0 ? thick_values[thick_values.length - 1] : null;

        currentItem && currentItem[culumnName] && thick_values.push(
            {
                elevation: thick_values.length > 0 ? before_tick_value.elevation - current_tick : Number(currentItem.elevation) - current_tick,
                depth: thick_values.length > 0 ? before_tick_value.depth + current_tick : current_tick,
                thick: current_tick
            }
        );
    });
    const sumOfThickness = thick_values.reduce(function (prev, next) { return prev + next.thick }, 0);
    return (
        <Dialog open={dialogInfo.isVisiable} onClose={onClose} fullWidth={true} maxWidth={'md'}>
            <DialogTitle>
                <Toolbar>
                    <Typography variant="h6" component="h2">
                        시추데이터 조회 || 시추데이터 수정
                    </Typography>
                    <div style={{ flexGrow: 1 }} />
                    <div style={{ margin: '0 8px' }}>
                        <Typography>{boreholeDataCount} 개 중 {Number(selectedIndex) + 1} 번</Typography>
                    </div>

                    <div style={{ margin: '0 8px' }}>
                        <IconButton onClick={() => { setSelectedIndex(Number(selectedIndex) - 1) }} disabled={Number(selectedIndex) == 0} ><NavigateBeforeIcon /></IconButton>
                        <IconButton onClick={() => { setSelectedIndex(Number(selectedIndex) + 1) }} disabled={Number(selectedIndex) + 1 == boreholeDataCount}><NavigateNextIcon /></IconButton>
                    </div>
                </Toolbar></DialogTitle>
            <DialogContent>
                <TableContainer className={classes.container} component={Paper}>
                    <Table>
                        <TableRow >
                            <TableCell variant='head'>이름</TableCell>
                            <TableCell>{currentItem?.name}</TableCell>
                            <TableCell variant='head'>지반표고</TableCell>
                            <TableCell>{currentItem?.elevation}</TableCell>
                        </TableRow>
                        <TableRow >
                            <TableCell variant='head'>Easting (X)</TableCell>
                            <TableCell>{currentItem?.easting}</TableCell>
                            <TableCell variant='head'>Northing (Y)</TableCell>
                            <TableCell>{currentItem?.northing}</TableCell>
                        </TableRow>
                    </Table>
                </TableContainer>
                <TableContainer className={classes.container} component={Paper}>
                    <Table stickyHeader aria-label="sticky table"  >
                        <TableHead className={classes.boreholeTableHead}>
                            <TableRow>
                                <TableCell variant='head' style={{ width: 60, textAlign: 'center', padding: 0 }}>표고<br />Elev.<br />Meter</TableCell>
                                <TableCell variant='head' style={{ width: 60, textAlign: 'center', padding: 0 }}>스케일<br />Scale<br />Meter</TableCell>
                                <TableCell variant='head' style={{ width: 60, textAlign: 'center', padding: 0 }}>심도<br />Depth<br />Meter</TableCell>
                                <TableCell variant='head' style={{ width: 60, textAlign: 'center', padding: 0 }}>층후<br />Thickness<br />Meter</TableCell>
                                <TableCell variant='head' style={{ width: 100, textAlign: 'center', padding: 0 }}>지층명</TableCell>
                                <TableCell variant='head' style={{ textAlign: 'center', padding: 0 }}>비고</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className={classes.boreholeTableBody} >
                            {thick_values.map((thick_value, idx) => (
                                <TableRow key={idx} className={classes.thickRow} style={{ height: `${(thick_value.thick * scale)}px`, overflow: 'hidden' }}>
                                    <TableCell className={classes.bottomCenter}>{thick_value.elevation.toFixed(2)}</TableCell>
                                    {idx === 0 ? <TableCell rowSpan={thick_values.length + 1}><ScaleRuller scale={scale} sumOfThickness={sumOfThickness + 5} width={60} /></TableCell> : <></>}
                                    <TableCell className={classes.bottomCenter}>{thick_value.depth.toFixed(2)}</TableCell>
                                    <TableCell className={classes.bottomCenter}>{thick_value.thick.toFixed(2)}</TableCell>
                                    <TableCell>-</TableCell>
                                    <TableCell>-</TableCell>
                                </TableRow>
                            ))}
                            {thick_values && thick_values.length > 0 ? <TableRow className={classes.thickRow} >
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell style={{ verticalAlign: 'top' }}>심도 {thick_values[thick_values.length - 1].depth.toFixed(2)} M 에서 시추종료</TableCell>
                            </TableRow> : <></>}
                        </TableBody>
                    </Table>
                </TableContainer>

            </DialogContent>
            <DialogActions>
                <div style={{ flexGrow: 1, width: 40, padding: '0 16px' }}>
                    <Typography id="discrete-slider" gutterBottom>Scale      </Typography>
                    <Slider
                        defaultValue={scale}
                        getAriaValueText={value => (`1 Meter : ${value} pixels`)}
                        aria-labelledby="discrete-slider"
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={30}
                        max={100}
                        onChange={(e, newValue) => {
                            setScale(newValue)
                        }}
                    />
                </div>


                <div style={{ flexGrow: 1 }} />
                <Button>취소</Button>
                <Button>저장</Button>

            </DialogActions>
        </Dialog >
    )
}
const useStyles = makeStyles(theme => (
    {
        container: {
            margin: theme.spacing(2, 0),
            maxHeight: 600
        },
        thickRow: {
            '&>.MuiTableCell-body': {
                padding: 0,
                border: '1px solid #eee',
                borderSpacing: '0',
                borderCollapse: 'collapse'
            }
        },
        boreholeTableHead: {
            '&>*': {
                padding: 0
            }
        },
        boreholeTableBody: {
            '&>*': {
                padding: 0
            }
        },
        bottomCenter: {
            verticalAlign: 'bottom',
            textAlign: 'center'
        }
    }
))
const ScaleRuller = ({ scale, sumOfThickness, width = 100 }) => {
    const height = sumOfThickness * scale;


    const canvasRef = createRef();
    /**
     * @type {HTMLCanvasElement}
     */
    let canvas = null;
    /**
     * @type {CanvasRenderingContext2D}
     */
    let ctx = null;
    // round pixelRatio, because older devices have a pixelRatio of 1.5. Treat them as @2x devices
    let pixelRatio = Math.round(window.devicePixelRatio) || 1;
    const collectedWidth = width * pixelRatio;
    const collectedHeight = height * pixelRatio;
    console.log(`pixelRatio: ${pixelRatio}`);
    useEffect(() => {
        canvas = canvasRef.current;
        canvas.width = collectedWidth;
        canvas.height = collectedHeight;
        canvas.style.width = Math.round(collectedWidth / pixelRatio) + "px";
        canvas.style.height = Math.round(collectedHeight / pixelRatio) + "px";
        ctx = canvas.getContext('2d');
        ctx.scale(pixelRatio, pixelRatio);
        ctx.strokeStyle = '#000'
        ctx.lineWidth = 1;

        for (let currentY = 0; currentY <= height; currentY += scale / 5) {
            ctx.beginPath();

            if (currentY % scale < 0.01) { ctx.moveTo(width - 20.5, currentY - 0.5) } else { ctx.moveTo(width - 10.5, currentY - 0.5) }
            ctx.lineTo(width, currentY - 0.5);
            ctx.stroke();
        }


    }, [scale, sumOfThickness]);
    return <canvas ref={canvasRef} width={width} height={height}></canvas>
}