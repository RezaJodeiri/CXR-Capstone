import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../../App";

describe("App", () => {
    test("default route should be login", () => {
        render(<App />);
        });
});
