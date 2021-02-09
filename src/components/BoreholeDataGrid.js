import React from "react";
import { Button, Toolbar } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { BoreholeViewerDialog } from "./BoreholeDataDialog";

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
  {
    field: "thick_1",
    headerName: "층이름#1",
    type: "number",
    width: 120,
  },
  {
    field: "thick_2",
    headerName: "층이름#1",
    type: "number",
    width: 120,
  },
  {
    field: "thick_3",
    headerName: "층이름#1",
    type: "number",
    width: 120,
  },
  {
    field: "thick_4",
    headerName: "층이름#1",
    type: "number",
    width: 120,
  },
  {
    field: "thick_5",
    headerName: "층이름#1",
    type: "number",
    width: 120,
  },
];

const rows = [
  {
    id: 1,
    name: "BH-1",
    easting: 197922.5154,
    northing: 434655.3096,
    elevation: 50.17,
    thick_1: 0.8,
    thick_2: 1.2,
    thick_3: 6.0,
    thick_4: 22,
  },
  {
    id: 2,
    name: "BH-2",
    easting: 197958.9944,
    northing: 434627.0276,
    elevation: 49.74,
    thick_1: 0.8,
    thick_2: 2.2,
    thick_3: 5.0,
    thick_4: 12,
  },
  {
    id: 3,
    name: "BH-3",
    easting: 197975.1464,
    northing: 434581.0906,
    elevation: 49.25,
    thick_1: 0.7,
    thick_2: 2.1,
    thick_3: 12.2,
    thick_4: 7,
  },
  {
    id: 4,
    name: "BH-4",
    easting: 197895.0414,
    northing: 434617.6986,
    elevation: 53.62,
    thick_1: 5.8,
    thick_2: 0.0,
    thick_3: 5.2,
    thick_4: 11,
  },
];
const strataNameDatas = [
  { id: "thick_1", name: "매립층" },
  { id: "thick_2", name: "퇴적층" },
  { id: "thick_3", name: "풍화토" },
  { id: "thick_4", name: "풍화암" },
  { id: "thick_5", name: "연암" },
  { id: "thick_6", name: "경암" },
];

const defaultDialogInfo = {
  isVisiable: false,
  boreholeData: null,
  strataNameDatas: null,
  epsg: "EPSG:3857",
};

const doExport = ({ epsg, strataNameDatas, rows }) => {
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
  element.download = "borehole_data.csv";
  document.body.appendChild(element);
  element.click();
};

export default function BoreholeDataGrid() {
  const [dialogInfo, setDialogInfo] = React.useState(defaultDialogInfo);
  const [selection, setSelection] = React.useState([]);

  const doEditHandler = () => {
    const rows_selected = rows.filter((e) => selection.includes(`${e.id}`));

    setDialogInfo({
      ...dialogInfo,
      isVisiable: true,
      boreholeData: rows_selected,
      strataNameDatas: strataNameDatas,
    });
  };

  return (
    <>
      <div style={{ height: 400, width: "100%" }}>
        <BoreholeToolbar
          doEdit={doEditHandler}
          doExport={() => {
            doExport({
              epsg: dialogInfo.epsg,
              strataNameDatas: strataNameDatas,
              rows: rows,
            });
            return true;
          }}
        />
        <DataGrid
          rows={rows}
          columns={columns}
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

const BoreholeToolbar = ({ doEdit, doExport }) => {
  return (
    <Toolbar>
      <Button>추가</Button>
      <Button onClick={doEdit}>편집</Button>
      <Button>삭제</Button>
      <div style={{ flexGrow: 1 }} />
      <Button>불러오기</Button>
      <Button
        onClick={() => {
          doExport && doExport();
        }}
      >
        내보내기
      </Button>
    </Toolbar>
  );
};
