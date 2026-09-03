import graphData from "../../../generated/content/graph.json";

import type {
  Cell,
  Case,
  ContentGraph,
  Crux,
  CruxId,
  Source,
  System,
  SystemId,
} from "../content/model";

export const graph = graphData as ContentGraph;

export const systems = graph.systems;
export const cruxes = graph.cruxes;
export const cells = graph.cells;

const systemsById = new Map<SystemId, System>(
  systems.map((system) => [system.id, system]),
);
const cruxesById = new Map<CruxId, Crux>(
  cruxes.map((crux) => [crux.id, crux]),
);
const cellsById = new Map<string, Cell>(cells.map((cell) => [cell.id, cell]));
const sourcesById = new Map<string, Source>(
  graph.sources.map((source) => [source.id, source]),
);

export function getSystem(id: SystemId): System {
  const system = systemsById.get(id);
  if (!system) throw new Error(`Unknown system: ${id}`);
  return system;
}

export function getCrux(id: CruxId): Crux {
  const crux = cruxesById.get(id);
  if (!crux) throw new Error(`Unknown crux: ${id}`);
  return crux;
}

export function getCell(id: string): Cell {
  const cell = cellsById.get(id);
  if (!cell) throw new Error(`Unknown cell: ${id}`);
  return cell;
}

export function cellsForSystem(system: SystemId): Cell[] {
  return cruxes.map((crux) => getCell(`${system}-${crux.id}`));
}

export function cellsForCrux(crux: CruxId): Cell[] {
  return systems.map((system) => getCell(`${system.id}-${crux}`));
}

export function sourcesForCells(selectedCells: Cell[]): Source[] {
  const ids = new Set(selectedCells.flatMap((cell) => cell.sources));
  return graph.sources.filter((source) => ids.has(source.id));
}

export function casesForCells(selectedCells: Cell[]): Case[] {
  const ids = new Set(selectedCells.flatMap((cell) => cell.cases));
  return graph.cases.filter((caseStudy) => ids.has(caseStudy.id));
}

export function sourcesForCell(cell: Cell): Source[] {
  return cell.sources.flatMap((id) => {
    const source = sourcesById.get(id);
    return source ? [source] : [];
  });
}

export function adjacentCell(
  cell: Cell,
  axis: "system" | "crux",
  offset: -1 | 1,
): Cell | undefined {
  const ordered = axis === "system" ? systems : cruxes;
  const currentId = axis === "system" ? cell.system : cell.crux;
  const index = ordered.findIndex((item) => item.id === currentId);
  const adjacent = ordered[index + offset];
  if (!adjacent) return undefined;

  const id =
    axis === "system"
      ? `${adjacent.id}-${cell.crux}`
      : `${cell.system}-${adjacent.id}`;
  return getCell(id);
}

export function cellHref(cell: Cell): string {
  return `/cells/${cell.id}/`;
}

export function systemHref(system: System | SystemId): string {
  return `/systems/${typeof system === "string" ? system : system.id}/`;
}

export function cruxHref(crux: Crux | CruxId): string {
  return `/cruxes/${typeof crux === "string" ? crux : crux.id}/`;
}
