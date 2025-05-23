import React, { useEffect, useState } from "react";
import CustomDropdown from "./CustomDropdown";

const App = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState([]);

  // Effect to perform the conversion
  useEffect(
    function () {
      async function getConvertedCurrency() {
        if (
          !amount ||
          !fromCurrency ||
          !toCurrency ||
          fromCurrency === toCurrency
        ) {
          return setConvertedAmount(amount);
        }
        try {
          setError("");
          setIsLoading(true);
          const res = await fetch(
            `https://api.frankfurter.dev/v1/latest?base=${fromCurrency}&symbols=${toCurrency}`
          );

          if (!res.ok) {
            throw new Error("Somthing went wrong with currency conversion!");
          }

          const data = await res.json();
          const convertedAmount = (amount * data.rates[toCurrency]).toFixed(2);
          setConvertedAmount(convertedAmount);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      getConvertedCurrency();
    },
    [fromCurrency, toCurrency, amount]
  );

  // Effect to get the currency code and name
  useEffect(function () {
    async function getCurrencies() {
      try {
        const res = await fetch(`https://api.frankfurter.dev/v1/currencies`);

        if (!res.ok) {
          throw new Error("Failed To Fetch Currency");
        }

        const data = await res.json();
        setCurrencySymbol(Object.entries(data));
      } catch (err) {
        setError(err.message);
      }
    }
    getCurrencies();
  }, []);

  useEffect(
    function () {
      if (!fromCurrency || !toCurrency) return;
      document.title = `Currency ${fromCurrency} - ${toCurrency}`;
    },
    [fromCurrency, toCurrency]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-4xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Currency Converter
        </h1>
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <CustomDropdown
            value={fromCurrency}
            onChange={setFromCurrency}
            options={currencySymbol}
            disabled={isLoading}
            placeholder="Select source currency"
          />
          <CustomDropdown
            value={toCurrency}
            onChange={setToCurrency}
            options={currencySymbol}
            disabled={isLoading}
            placeholder="Select target currency"
          />
        </div>
        <div className="text-center">
          {isLoading && (
            <p className="text-blue-600 text-2xl font-medium animate-pulse">
              Converting...
            </p>
          )}
          {error && <p className="text-red-600 font-medium"> {error} </p>}
          {!error && !isLoading && convertedAmount > 0 && (
            <p className="text-2xl font-semibold text-gray-800">
              {amount} {fromCurrency} = {convertedAmount} {toCurrency}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
