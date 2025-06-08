const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const convertBtn = document.querySelector("form button");
const message = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");

// Populate dropdowns with currency codes
dropdowns.forEach((select) => {
  for (let code in countryList) {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = code;

    if (select.name === "form" && code === "USD") {
      option.selected = true;
    } else if (select.name === "to" && code === "NPR") {
      option.selected = true;
    }

    select.appendChild(option);
  }

  select.addEventListener("change", (e) => updateFlag(e.target));
});

// Update flag image based on selected currency
function updateFlag(selectElement) {
  const currencyCode = selectElement.value;
  const countryCode = countryList[currencyCode];
  const flagURL = `https://flagsapi.com/${countryCode}/flat/64.png`;

  const img = selectElement.parentElement.querySelector("img");
  if (img) img.src = flagURL;
}

// Fetch exchange rate and update message
async function updateExchangeRate() {
  let amountValue = parseFloat(amountInput.value);
  if (isNaN(amountValue) || amountValue < 1) {
    amountValue = 1;
    amountInput.value = "1";
  }

  const from = fromCurrency.value.toLowerCase();
  const to = toCurrency.value.toLowerCase();
  const url = `${BASE_URL}/${from}.json`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const rate = data[from][to];
    const converted = (amountValue * rate).toFixed(2);

    message.textContent = `${amountValue} ${fromCurrency.value} = ${converted} ${toCurrency.value}`;
  } catch (error) {
    message.textContent = "Error fetching exchange rate.";
    console.error("Exchange rate error:", error);
  }
}

// Convert on button click
convertBtn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

// Auto-convert on page load
window.addEventListener("load", updateExchangeRate);
