"use client";

import { useEffect, useState } from "react";
import { fetchWords, solveWordle } from "../lib/wordleLogic";

export default function WordleSolver() {
  // State
  const [allWords, setAllWords] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Inputs
  const [pattern, setPattern] = useState<string[]>(["", "", "", "", ""]); // Green
  const [excluded, setExcluded] = useState(""); // Grey
  const [yellows, setYellows] = useState<string[]>(["", "", "", "", ""]); // Yellow row
  
  // Results
  const [results, setResults] = useState<string[]>([]);

  // Load Dictionary
  useEffect(() => {
    fetchWords().then((data) => {
      setAllWords(data);
      setResults(data);
      setLoading(false);
    });
  }, []);

  // Run Solver
  useEffect(() => {
    if (allWords.length === 0) return;
    const matches = solveWordle(allWords, pattern, excluded, yellows);
    setResults(matches);
  }, [pattern, excluded, yellows, allWords]);

  // Handlers
  const handlePatternChange = (index: number, value: string) => {
    const newPattern = [...pattern];
    newPattern[index] = value.slice(-1); // Only 1 char allowed for Green
    setPattern(newPattern);
  };

  const handleYellowChange = (index: number, value: string) => {
    const newYellows = [...yellows];
    newYellows[index] = value; // Multiple chars allowed (e.g. "ab" if you tried both at this spot)
    setYellows(newYellows);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-emerald-400 mb-2">Wordle Solver</h1>
          <p className="text-gray-400 text-sm">
            {loading ? "Loading dictionary..." : `Dictionary loaded (${allWords.length} words)`}
          </p>
        </div>

        {/* 1. GREEN (Correct Position) */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-emerald-500 rounded-full"></span> 
            Correct Positions (Green)
          </h2>
          <div className="flex gap-2 justify-center">
            {pattern.map((char, i) => (
              <input
                key={`green-${i}`}
                type="text"
                value={char}
                onChange={(e) => handlePatternChange(i, e.target.value)}
                placeholder="_"
                className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 border-2 border-gray-600 rounded-lg focus:border-emerald-500 focus:outline-none uppercase placeholder-gray-600"
                maxLength={1}
              />
            ))}
          </div>
        </div>

        {/* 2. YELLOW (Wrong Position) */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-yellow-400 font-bold mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            Wrong Positions (Yellow)
          </h2>
          <p className="text-xs text-gray-400 mb-3 text-center">
             Type letters that appeared <b>yellow</b> in these specific slots. You can type multiple letters per box.
          </p>
          <div className="flex gap-2 justify-center">
            {yellows.map((chars, i) => (
              <input
                key={`yellow-${i}`}
                type="text"
                value={chars}
                onChange={(e) => handleYellowChange(i, e.target.value)}
                className="w-12 h-12 text-center text-lg font-bold bg-gray-700 border-2 border-yellow-600/50 rounded-lg focus:border-yellow-400 focus:outline-none uppercase text-yellow-400 placeholder-gray-600"
                placeholder="?"
              />
            ))}
          </div>
        </div>

        {/* 3. GREY (Excluded) */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-gray-400 font-bold mb-4 flex items-center gap-2">
             <span className="w-3 h-3 bg-gray-500 rounded-full"></span> 
             Excluded Letters (Grey)
          </h2>
          <input
            type="text"
            value={excluded}
            onChange={(e) => setExcluded(e.target.value)}
            placeholder="TYPE DEAD LETTERS..."
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-lg tracking-widest uppercase focus:border-gray-400 focus:outline-none"
          />
        </div>

        {/* RESULTS */}
        <div className="border-t border-gray-700 pt-8">
          <h3 className="text-xl font-bold mb-4">
            Possible Matches: <span className="text-emerald-400">{results.length}</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {results.slice(0, 100).map((word, idx) => (
              <div key={idx} className="bg-gray-800 p-2 text-center rounded border border-gray-700 font-mono tracking-widest text-lg uppercase hover:bg-gray-700 transition cursor-pointer select-all">
                {word}
              </div>
            ))}
            {results.length > 100 && (
              <div className="col-span-full text-center text-gray-500 py-2 italic">
                ...and {results.length - 100} more
              </div>
            )}
            {results.length === 0 && (
               <div className="col-span-full text-center text-red-400 py-4">
                No words match these criteria.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}