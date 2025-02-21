"use client";
import React, { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import axios from "axios";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState(null);
  const [processedData, setProcessedData] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate JSON format first

      const data = await axios.post(
        "http://localhost:3001/bfhl",
        JSON.parse(jsonInput)
      );
      console.log(data);
      if (data.status != 200) {
        throw new Error("Server error occurred");
      }
      setProcessedData({
        alphabets: data.data.alphabets,
        numbers: data.data.numbers,
        highest_alphabet: data.data.highest_alphabet,
      });
      setError(null);
    } catch (e) {
      console.log(e);
      if (e instanceof SyntaxError) {
        setError("Invalid JSON format");
      } else {
        setError("Failed to process the request");
      }
      setProcessedData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFilteredData = () => {
    if (!processedData) return null;

    return (
      <div className="mt-6 space-y-4">
        {selectedFilters.includes("Alphabets") && processedData.alphabets && (
          <div>
            <h3 className="font-semibold">Alphabets:</h3>
            <p className="mt-1">{processedData.alphabets.join(", ")}</p>
          </div>
        )}
        {selectedFilters.includes("Numbers") && processedData.numbers && (
          <div>
            <h3 className="font-semibold">Numbers:</h3>
            <p className="mt-1">{processedData.numbers.join(", ")}</p>
          </div>
        )}
        {selectedFilters.includes("Highest alphabet") &&
          processedData.highestAlphabet && (
            <div>
              <h3 className="font-semibold">Highest Alphabet:</h3>
              <p className="mt-1">{processedData.highest_alphabet}</p>
            </div>
          )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          22bcs10206
        </h1>

        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="json-input"
                className="block text-sm font-medium text-gray-700"
              >
                JSON Input
              </label>
              <textarea
                id="json-input"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                rows={4}
                placeholder='e.g. ["a", "b", 1, 2, "z"]'
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                "Validate and Process"
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 rounded-md bg-red-50 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {processedData && (
            <div className="mt-6">
              <div className="flex items-center gap-2 text-green-700 mb-4">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm">
                  Valid JSON processed successfully
                </span>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Select filters to display:
                </label>
                <div className="space-y-2">
                  {["Alphabets", "Numbers", "Highest alphabet"].map(
                    (option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedFilters.includes(option)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFilters([...selectedFilters, option]);
                            } else {
                              setSelectedFilters(
                                selectedFilters.filter((f) => f !== option)
                              );
                            }
                          }}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {option}
                        </span>
                      </label>
                    )
                  )}
                </div>

                {renderFilteredData()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
