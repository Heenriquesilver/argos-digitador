import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";

export default function WorkflowFilters() {
  const [filter, setFilter] = useState("todos");

  return (
    <ToggleButtonGroup
      value={filter}
      exclusive
      onChange={(_, v) => v && setFilter(v)}
      size="small"
    >
      <ToggleButton value="todos">Todos</ToggleButton>
      <ToggleButton value="alta">Alta Complexidade</ToggleButton>
      <ToggleButton value="recentes">Recentes</ToggleButton>
    </ToggleButtonGroup>
  );
}
