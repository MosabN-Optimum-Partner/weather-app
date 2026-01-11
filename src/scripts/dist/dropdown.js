const defaultSettings = {
    Temperature: "Celsius",
    Wind: "kmh",
    Precipitation: "mm",
    Theme: "Dark",
};
const text = document.querySelector(".selected-day");
const loadingPreferences = localStorage.getItem("userPreferenece");
export let userPreferenece = loadingPreferences
    ? JSON.parse(loadingPreferences)
    : defaultSettings;
localStorage.setItem("userPreferenece", JSON.stringify(userPreferenece));
const lists = document.querySelectorAll(".unit");
lists.forEach((btn) => {
    btn.addEventListener("click", () => {
        const parent = btn.parentElement;
        if (parent) {
            const dropdown = parent.querySelector(".unit-list");
            if (dropdown) {
                dropdown.classList.toggle("hidden");
            }
        }
    });
});
const allDaysRadios = document.querySelectorAll("input[name='Day']");
allDaysRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
        if (radio.checked) {
            text.textContent = radio.value;
        }
    });
});
window.addEventListener("click", (e) => {
    const target = e.target;
    const isBtn = target.closest(".unit");
    const isDropdown = target.closest(".unit-list");
    if (!isBtn && !isDropdown) {
        const dropdowns = document.querySelectorAll(".unit-list");
        dropdowns.forEach((dropdown) => {
            dropdown.classList.add("hidden");
        });
        return;
    }
    if (isDropdown) {
        const radioInput = target.closest(".hidden-radio");
        if (radioInput) {
            const inputName = radioInput.getAttribute("name");
            const value = radioInput.value;
            if (inputName !== "Day") {
                userPreferenece = {
                    ...userPreferenece,
                    [inputName]: value.toLowerCase(),
                };
                localStorage.setItem("userPreferenece", JSON.stringify(userPreferenece));
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
function applySetting() {
    const loadingPreferences = localStorage.getItem("userPreferenece");
    const userPreferenece = JSON.parse(loadingPreferences);
    for (const [key, value] of Object.entries(userPreferenece)) {
        if (key !== "Day") {
            const query = `input[name="${key}"][value="${value}"]`;
            const radioToCheck = document.querySelector(query);
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
];
const today = DAYS[new Date().getDay()];
function checkToday() {
    const query = `input[name="Day"][value="${today}"]`;
    const todayRadio = document.querySelector(query);
    if (todayRadio) {
        todayRadio.checked = true;
    }
}
//# sourceMappingURL=dropdown.js.map