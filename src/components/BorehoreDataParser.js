/**
 *
 * @param {string} csv
 */
export function parseBoreholeData(csv) {
  const lines = csv.trim().split("\n");
  if (lines.length > 0 && lines[0].indexOf("bhd-v1") === 0) {
    const columns = lines[0].split(",");
    const crs = columns[2];
    const columnNames = columns.slice(4);
    const columnIds = lines[1].split(",").slice(4);
    const headerRows = 2;
    const recordCount = lines.length - headerRows;

    const result = [];
    const strataNameDatas = [];
    for (let idx = 0; idx < columnIds.length; idx++) {
      strataNameDatas.push({
        id: columnIds[idx],
        name: columnNames[idx],
      });
    }
    for (let idx = 0; idx < recordCount; idx += 1) {
      const columnData = lines[idx + headerRows].split(",");
      const name = columnData[0].trim();
      const easting = Number(columnData[1]);
      const northing = Number(columnData[2]);
      const elevation = Number(columnData[3]);
      const data = { id: idx, name, easting, northing, elevation };
      for (let idx_j = 0; idx_j < columnNames.length; idx_j++) {
        const val = columnData[idx_j + 4];
        const colId = columnIds[idx_j].trim();
        data[colId] = Number(val);
      }
      result.push(data);
    }
    return {
      crs,
      result,
      strataNameDatas,
    };
  } else {
    throw new Error("CSV 파일이 지정된 템플릿 버전과 다릅니다.");
  }
}
