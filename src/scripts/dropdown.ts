import { handleSearch } from "./render.js";

export interface preferences {
  Temperature: "Celsius" | "Fahrenheit";
  Wind: "kmh" | "mph";
  Precipitation: "mm" | "inch";
  Theme: "Dark" | "Light";
}
const defaultSettings: preferences = {
  Temperature: "Celsius",
  Wind: "kmh",
  Precipitation: "mm",
  Theme: "Dark",
};
const text = document.querySelector(".selected-day") as HTMLSpanElement;

const loadingPreferences: string | null =
  localStorage.getItem("userPreferenece");
export let userPreferenece = loadingPreferences
  ? JSON.parse(loadingPreferences)
  : defaultSettings;

localStorage.setItem("userPreferenece", JSON.stringify(userPreferenece));

const lists: NodeListOf<HTMLDivElement> =
  document.querySelectorAll<HTMLDivElement>(".unit");
lists.forEach((btn) => {
  btn.addEventListener("click", () => {
    const parent = btn.parentElement as HTMLDivElement;
    if (parent) {
      const dropdown = parent.querySelector<HTMLDivElement>(".unit-list");
      if (dropdown) {
        dropdown.classList.toggle("hidden");
      }
    }
  });
});

const allDaysRadios: NodeListOf<HTMLInputElement> =
  document.querySelectorAll("input[name='Day']");
allDaysRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    if (radio.checked) {
      text.textContent = radio.value;
    }
  });
});

window.addEventListener("click", (e: MouseEvent) => {
  const target = e.target as HTMLDivElement;

  const isBtn = target.closest(".unit") as HTMLDivElement;
  const isDropdown = target.closest(".unit-list") as HTMLDivElement;

  if (!isBtn && !isDropdown) {
    const dropdowns = document.querySelectorAll<HTMLElement>(".unit-list");
    dropdowns.forEach((dropdown) => {
      dropdown.classList.add("hidden");
    });
    return;
  }
  if (isDropdown) {
    const radioInput = target.closest<HTMLInputElement>(".hidden-radio");
    if (radioInput) {
      const inputName = radioInput.getAttribute("name") as string;
      const value = radioInput.value;
      if (inputName !== "Day") {
        userPreferenece = {
          ...userPreferenece,
          [inputName]: value.toLowerCase(),
        };
        localStorage.setItem(
          "userPreferenece",
          JSON.stringify(userPreferenece)
        );
        handleSearch();
      }
    }
    const changeToImperial = isDropdown.querySelector("button");
    if (changeToImperial) {
      changeToImperial.textContent = "Hello";
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  applySetting();
  checkToday();
});

function applySetting(): void {
  const loadingPreferences = localStorage.getItem("userPreferenece") as string;
  const userPreferenece: preferences = JSON.parse(loadingPreferences);
  for (const [key, value] of Object.entries(userPreferenece)) {
    if (key !== "Day") {
      const query = `input[name="${key}"][value="${value}"]`;
      const radioToCheck = document.querySelector<HTMLInputElement>(query);

      if (radioToCheck) {
        radioToCheck.checked = true;
      }
    }
  }
}

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;
type Day = (typeof DAYS)[number];
const today = DAYS[new Date().getDay()] as Day;

function checkToday(): void {
  const query = `input[name="Day"][value="${today}"]`;
  const todayRadio = document.querySelector<HTMLInputElement>(query);
  if (todayRadio) {
    todayRadio.checked = true;
  }
}
