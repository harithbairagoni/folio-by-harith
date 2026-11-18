import React from "react";
import { createRoot } from "react-dom/client";
import ResumePage from "./components/ResumePage";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ResumePage />
  </React.StrictMode>,
);
