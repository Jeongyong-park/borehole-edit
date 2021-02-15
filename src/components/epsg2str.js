/**
 *
 * @param {string} epsg
 */
export const epsg2Str = (epsg) => {
  switch (epsg) {
    case "EPSG:4326":
    case "EPSG:4166":
      return `WGS84 전구 좌표계 (${epsg})`;

    case "EPSG:3857":
    case "EPSG:900913":
      return `WGS84 전구 좌표계 (${epsg})`;

    case "EPSG:4019":
    case "EPSG:4737 ":
      return `GRS80 전구 좌표계 (${epsg})`;

    case "EPSG:2096":
      return `구, 동부 원점 좌표계 (Bessel, ${epsg})`;
    case "EPSG:2097":
      return `구, 중부 원점 좌표계 (Bessel, ${epsg})`;
    case "EPSG:2098":
      return `구, 서부 원점 좌표계 (Bessel, ${epsg})`;

    case "EPSG:5173":
      return `구, 보정 서부 원점 좌표계 (Bessel, ${epsg})`;
    case "EPSG:5174":
      return `구, 보정 중부 원점 좌표계 (Bessel, ${epsg})`;
    case "EPSG:5175":
      return `구, 보정 제주 원점 좌표계 (Bessel, ${epsg})`;
    case "EPSG:5176":
      return `구, 보정 동부 원점 좌표계 (Bessel, ${epsg})`;
    case "EPSG:5177":
      return `구, 보정 동해(울릉) 원점 좌표계 (Bessel, ${epsg})`;

    case "EPSG:5178":
      return `UTM-K(새주소) 원점 좌표계 (Bessel, ${epsg})`;
    case "EPSG:5179":
      return `UTM-K(네이버) 원점 좌표계 (GRS80, ${epsg})`;

    case "EPSG:5180":
      return `구, 서부 원점 좌표계 (GRS80, ${epsg})`;
    case "EPSG:5181":
      return `구, 중부 원점 좌표계 (GRS80, ${epsg})`;
    case "EPSG:5182":
      return `구, 제주 원점 좌표계 (GRS80, ${epsg})`;
    case "EPSG:5183":
      return `구, 동부 원점 좌표계 (GRS80, ${epsg})`;
    case "EPSG:5184":
      return `구, 동해(울릉) 원점 좌표계 (GRS80, ${epsg})`;

    case "EPSG:5185":
      return `현행, 서부 원점 좌표계 (GRS80, ${epsg})`;
    case "EPSG:5186":
      return `현행, 중부 원점 좌표계 (GRS80, ${epsg})`;
    case "EPSG:5187":
      return `현행, 동부 원점 좌표계 (GRS80, ${epsg})`;
    case "EPSG:5188":
      return `현행, 동해(울릉) 원점 좌표계 (GRS80, ${epsg})`;

    default:
      return `알 수 없음(${epsg})`;
  }
};
