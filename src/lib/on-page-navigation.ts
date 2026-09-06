export interface OnPageNavigationItem {
  id: string;
  label: string;
}

export const minimumOnPageNavigationItems = 3;

export function hasUsefulOnPageNavigation(
  items: readonly OnPageNavigationItem[],
) {
  return items.length >= minimumOnPageNavigationItems;
}
