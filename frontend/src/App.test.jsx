import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import App from "./App";

test("renders App component without crashing", () => {
  render(<App />);
  expect(true).toBe(true);
});
