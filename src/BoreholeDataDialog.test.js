import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";

test("renders learn react link", async () => {
  render(<App />);

  fireEvent.click(screen.getByText("편집"));

  await waitFor(() => screen.getByRole("title"));

  expect(screen.getByRole("title")).toHaveTextContent("시추데이터 조회");
});
