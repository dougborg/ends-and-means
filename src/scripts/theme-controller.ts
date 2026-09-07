type ThemePreference = "system" | "light" | "dark";

const root = document.documentElement;
const storageKey = "ends-and-means-theme";
const systemPreference = matchMedia("(prefers-color-scheme: dark)");

function isExplicitPreference(
  value: string | null,
): value is Exclude<ThemePreference, "system"> {
  return value === "light" || value === "dark";
}

function readStoredPreference(): {
  available: boolean;
  preference: ThemePreference;
} {
  try {
    const value = localStorage.getItem(storageKey);
    if (isExplicitPreference(value))
      return { available: true, preference: value };
    if (value !== null) localStorage.removeItem(storageKey);
    return { available: true, preference: "system" };
  } catch {
    return { available: false, preference: "system" };
  }
}

function effectiveTheme(preference: ThemePreference) {
  return preference === "system"
    ? systemPreference.matches
      ? "dark"
      : "light"
    : preference;
}

function updateThemeColors(
  preference: ThemePreference,
  effective: "light" | "dark",
) {
  const light = document.querySelector<HTMLMetaElement>(
    'meta[data-theme-color="light"]',
  );
  const dark = document.querySelector<HTMLMetaElement>(
    'meta[data-theme-color="dark"]',
  );
  if (!light || !dark) return;
  if (preference === "system") {
    light.media = "(prefers-color-scheme: light)";
    dark.media = "(prefers-color-scheme: dark)";
    return;
  }
  light.media = effective === "light" ? "all" : "not all";
  dark.media = effective === "dark" ? "all" : "not all";
}

function applyPreference(preference: ThemePreference) {
  if (preference === "system") root.removeAttribute("data-theme");
  else root.dataset.theme = preference;
  const effective = effectiveTheme(preference);
  root.dataset.effectiveTheme = effective;
  updateThemeColors(preference, effective);
}

const stored = readStoredPreference();
let preference: ThemePreference = isExplicitPreference(
  root.dataset.theme ?? null,
)
  ? (root.dataset.theme as Exclude<ThemePreference, "system">)
  : stored.preference;

function persistPreference(next: ThemePreference) {
  try {
    if (next === "system") localStorage.removeItem(storageKey);
    else localStorage.setItem(storageKey, next);
  } catch {
    /* Keep the in-memory selection for this document when storage is denied. */
  }
}

function synchronizeControl() {
  const control = document.querySelector<HTMLFieldSetElement>(
    "[data-theme-control]",
  );
  if (!control) return;
  const selected = control.querySelector<HTMLInputElement>(
    `input[value="${preference}"]`,
  );
  if (selected) selected.checked = true;
  if (control.dataset.themeControlReady === "true") return;
  control.dataset.themeControlReady = "true";
  control.addEventListener("change", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.name !== "appearance")
      return;
    if (
      input.value !== "system" &&
      input.value !== "light" &&
      input.value !== "dark"
    )
      return;
    preference = input.value;
    persistPreference(preference);
    applyPreference(preference);
  });
}

systemPreference.addEventListener("change", () => {
  if (preference === "system") applyPreference(preference);
});
addEventListener("storage", (event) => {
  if (event.key !== storageKey) return;
  preference = isExplicitPreference(event.newValue) ? event.newValue : "system";
  applyPreference(preference);
  synchronizeControl();
});
addEventListener("pageshow", () => {
  const currentPagePreference = isExplicitPreference(root.dataset.theme ?? null)
    ? (root.dataset.theme as Exclude<ThemePreference, "system">)
    : preference;
  const restored = readStoredPreference();
  preference = restored.available ? restored.preference : currentPagePreference;
  applyPreference(preference);
  queueMicrotask(synchronizeControl);
});
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", synchronizeControl, {
    once: true,
  });
} else synchronizeControl();
