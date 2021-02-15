import React, { createRef } from "react";
import { Button, Toolbar, Typography } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { BoreholeViewerDialog } from "./BoreholeDataDialog";
import { parseBoreholeData } from "./BorehoreDataParser";

const columns = [
  { field: "id", headerName: "#", type: "number", width: 60 },
  { field: "name", headerName: "Name", width: 90 },
  { field: "easting", headerName: "Easting", type: "number", width: 140 },
  { field: "northing", headerName: "Northing", type: "number", width: 140 },
  {
    field: "elevation",
    headerName: "Ground Eleveation",
    type: "number",
    width: 120,
  },
];

// const rows = testRecordsData;
// const strataNameDatas = [
//   { id: "thick_1", name: "매립층" },
//   { id: "thick_2", name: "퇴적층" },
//   { id: "thick_3", name: "풍화토" },
//   { id: "thick_4", name: "풍화암" },
//   { id: "thick_5", name: "연암" },
//   { id: "thick_6", name: "경암" },
// ];

const defaultDialogInfo = {
  isVisiable: false,
  boreholeData: null,
  strataNameDatas: null,
  epsg: "EPSG:3857",
};

const doExport = ({
  epsg,
  strataNameDatas,
  rows,
  exportFilename = "borehole_data.csv",
}) => {
  const element = document.createElement("a");

  const csvData = [
    `bhd-v1, 좌표계:,${epsg},layername:, ${strataNameDatas
      .map((e) => e.name)
      .join(", ")}`,
    "name, easting, northing, ground_altitude, thick_1, thick_2, thick_3, thick_4, thick_5, thick_6",
  ];

  rows.map((row) => {
    csvData.push(
      `${row.name}, ${row.northing}, ${row.easting}, ${
        row.elevation
      }, ${strataNameDatas.map((e) => row[e.id]).join(",")}`
    );
    return true;
  });
  const file = new Blob(["\uFEFF" + csvData.join("\r\n")], {
    type: "text/csv;charset=utf-8",
  });
  element.href = URL.createObjectURL(file);
  element.download = exportFilename;
  document.body.appendChild(element);
  element.click();
};

export default function BoreholeDataGrid() {
  const [dialogInfo, setDialogInfo] = React.useState(defaultDialogInfo);
  const [selection, setSelection] = React.useState([]);
  const [crs, setCrs] = React.useState("");
  const [rows, setRows] = React.useState([]);
  const [columnsForGrid, setColumnsForGrid] = React.useState([]);
  const [strataNameDatas, setStrataNameDatas] = React.useState([]);
  const doEditHandler = () => {
    const rows_selected = rows.filter((e) => selection.includes(`${e.id}`));

    setDialogInfo({
      ...dialogInfo,
      epsg: crs,
      isVisiable: true,
      boreholeData: rows_selected,
      strataNameDatas: strataNameDatas,
    });
  };

  const handlerCallbackLoadBoreholeData = ({
    crs,
    result,
    strataNameDatas,
  }) => {
    crs && setCrs(crs);
    result && setRows(result);
    strataNameDatas && setStrataNameDatas(strataNameDatas);
  };
  React.useEffect(() => {
    const columnsForGrid = [...columns];
    for (const strataData of strataNameDatas) {
      columnsForGrid.push({
        field: strataData.id,
        headerName: strataData.name,
        type: "number",
        width: 120,
      });
    }
    setColumnsForGrid(columnsForGrid);
  }, [strataNameDatas]);

  return (
    <>
      <div style={{ height: 400, width: "100%" }}>
        <BoreholeToolbar
          crs={crs}
          doEdit={doEditHandler}
          doExport={() => {
            doExport({
              epsg: dialogInfo.epsg,
              strataNameDatas: strataNameDatas,
              rows: rows,
            });
            return true;
          }}
          callbackLoadBoreholeData={handlerCallbackLoadBoreholeData}
        />
        <DataGrid
          rows={rows}
          columns={columnsForGrid}
          checkboxSelection
          onSelectionChange={(newSelection) => {
            setSelection(newSelection.rowIds);
          }}
        />
      </div>
      <BoreholeViewerDialog
        dialogInfo={dialogInfo}
        onClose={() => setDialogInfo({ ...dialogInfo, isVisiable: false })}
      />
    </>
  );
}

const BoreholeToolbar = ({
  crs,
  doEdit,
  doExport,
  callbackLoadBoreholeData,
}) => {
  const refFileInput = createRef();

  const handlerImportBtn = () => {
    refFileInput.current.click();
  };
  React.useEffect(() => {
    refFileInput.current.onchange = (event) => {
      if (event.currentTarget.files.length > 0) {
        /** @type{File} */
        const csvFile = event.currentTarget.files[0];
        const reader = new FileReader();

        reader.onload = () => {
          const boreholeDataResult = parseBoreholeData(reader.result);
          callbackLoadBoreholeData &&
            callbackLoadBoreholeData(boreholeDataResult);
        };

        reader.readAsText(csvFile, "UTF-8");
      }
    };
  }, [callbackLoadBoreholeData, refFileInput]);

  return (
    <Toolbar>
      <Button>추가</Button>
      <Button onClick={doEdit}>편집</Button>
      <Button>삭제</Button>
      <div style={{ flexGrow: 1 }} />
      <Typography variant="body2">crs: {crs || "알 수 없음"}</Typography>
      <Button onClick={handlerImportBtn}>불러오기</Button>
      <Button
        onClick={() => {
          doExport && doExport();
        }}
      >
        내보내기
      </Button>
      <input
        type="file"
        ref={refFileInput}
        accept=".csv"
        style={{ display: "none" }}
      ></input>
    </Toolbar>
  );
};
