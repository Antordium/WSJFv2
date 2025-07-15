// pages/index.tsx
import React, { useRef, useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs for initiatives

// --- Interfaces and Calculation Utilities (normally in utils/calculator.ts) ---
export interface CoDScores {
  uvTri: number; // User Value / Training Readiness Impact
  tcEd: number;  // Time Criticality / Event Dependency
  rrOe: number;  // Risk Reduction / Opportunity Enablement
  crSla: number; // Compliance / Regulatory / SLA
}

export interface CoDWeights {
  wUvTri: number;
  wTcEd: number;
  wRrOe: number;
  wCrSla: number;
}

export interface Initiative extends CoDScores {
  id: string; // Unique ID for keying in React lists
  name: string;
  jobSize: number; // Story Points
  calculatedCoD?: number;
  calculatedWsjf?: number;
}

export const calculateCoD = (scores: CoDScores, weights: CoDWeights): number => {
  const { uvTri, tcEd, rrOe, crSla } = scores;
  const { wUvTri, wTcEd, wRrOe, wCrSla } = weights;
  return (uvTri * wUvTri) + (tcEd * wTcEd) + (rrOe * wRrOe) + (crSla * wCrSla);
};

export const calculateWsjf = (CoD: number, jobSize: number): number => {
  // Prevent division by zero or negative job size, which would be illogical
  return jobSize > 0 ? CoD / jobSize : 0;
};
// --- End of Interfaces and Calculation Utilities ---


// --- DarkModeToggle Component (normally in components/DarkModeToggle.tsx) ---
const DarkModeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // On component mount, check user's system preference or local storage (if any was set)
    // For this session-cleared app, we'll default to system preference initially
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialMode = prefersDark; // No persistence, so just default to system
    setIsDarkMode(initialMode);
    document.documentElement.classList.toggle('dark', initialMode);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    // You could save this to localStorage if you wanted preference persistence during the session
    // localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? '🌙 Light Mode' : '☀️ Dark Mode'}
    </button>
  );
};
// --- End of DarkModeToggle Component ---


// --- WeightsConfiguration Component (normally in components/WeightsConfiguration.tsx) ---
interface WeightsConfigurationProps {
  weights: CoDWeights;
  setWeights: React.Dispatch<React.SetStateAction<CoDWeights>>;
}

const WeightsConfiguration: React.FC<WeightsConfigurationProps> = ({ weights, setWeights }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWeights(prev => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  const weightFields = [
    { label: "User Value / Training Readiness Impact (UV/TRI) Weight", name: "wUvTri", value: weights.wUvTri },
    { label: "Time Criticality / Event Dependency (TC/ED) Weight", name: "wTcEd", value: weights.wTcEd },
    { label: "Risk Reduction / Opportunity Enablement (RR/OE) Weight", name: "wRrOe", value: weights.wRrOe },
    { label: "Compliance / Regulatory / SLA (CR/SLA) Weight", name: "wCrSla", value: weights.wCrSla },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {weightFields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label htmlFor={field.name} className="text-sm font-medium mb-1 dark:text-gray-300">
            {field.label}:
          </label>
          <input
            type="number"
            id={field.name}
            name={field.name}
            value={field.value}
            onChange={handleChange}
            min="0"
            step="0.1"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      ))}
    </div>
  );
};
// --- End of WeightsConfiguration Component ---


// --- InitiativeInputForm Component (normally in components/InitiativeInputForm.tsx) ---
interface InitiativeInputFormProps {
  onAdd: (initiative: Omit<CoDScores & { name: string; jobSize: number }, 'calculatedCoD' | 'calculatedWsjf'>) => void;
}

const InitiativeInputForm: React.FC<InitiativeInputFormProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [uvTri, setUvTri] = useState(5);
  const [tcEd, setTcEd] = useState(5);
  const [rrOe, setRrOe] = useState(5);
  const [crSla, setCrSla] = useState(5);
  const [jobSize, setJobSize] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Initiative Name cannot be empty.');
      return;
    }
    onAdd({
      name,
      uvTri,
      tcEd,
      rrOe,
      crSla,
      jobSize,
    });
    // Reset form
    setName('');
    setUvTri(5);
    setTcEd(5);
    setRrOe(5);
    setCrSla(5);
    setJobSize(5);
  };

  const scoreFields = [
    { label: "User Value / Training Readiness Impact (1-10)", value: uvTri, setter: setUvTri },
    { label: "Time Criticality / Event Dependency (1-10)", value: tcEd, setter: setTcEd },
    { label: "Risk Reduction / Opportunity Enablement (1-10)", value: rrOe, setter: setRrOe },
    { label: "Compliance / Regulatory / SLA (1-10)", value: crSla, setter: setCrSla },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="initiativeName" className="block text-sm font-medium mb-1 dark:text-gray-300">
          Initiative Name/Description:
        </label>
        <input
          type="text"
          id="initiativeName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scoreFields.map((field) => (
          <div key={field.label}>
            <label htmlFor={field.label.replace(/\s/g, '')} className="block text-sm font-medium mb-1 dark:text-gray-300">
              {field.label}: {field.value}
            </label>
            <input
              type="range"
              id={field.label.replace(/\s/g, '')}
              min="1"
              max="10"
              value={field.value}
              onChange={(e) => field.setter(parseInt(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-600 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:appearance-none"
            />
          </div>
        ))}
      </div>

      <div>
        <label htmlFor="jobSize" className="block text-sm font-medium mb-1 dark:text-gray-300">
          Job Size (Story Points): {jobSize}
        </label>
        <input
          type="range"
          id="jobSize"
          min="1"
          max="20" // Assuming a max story point of 20 for typical Agile teams
          value={jobSize}
          onChange={(e) => setJobSize(parseInt(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-600 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:appearance-none"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Add Initiative
      </button>
    </form>
  );
};
// --- End of InitiativeInputForm Component ---


// --- InitiativesTable Component (normally in components/InitiativesTable.tsx) ---
interface InitiativesTableProps {
  initiatives: Initiative[];
  onDelete: (id: string) => void;
}

const InitiativesTable: React.FC<InitiativesTableProps> = ({ initiatives, onDelete }) => {
  if (initiatives.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400">No initiatives added yet. Add some above to see them here.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 shadow-sm rounded-lg">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
              Initiative
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
              UV/TRI
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
              TC/ED
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
              RR/OE
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
              CR/SLA
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
              Job Size (SP)
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
              CoD
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
              WSJF
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {initiatives.map((initiative) => (
            <tr key={initiative.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                {initiative.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {initiative.uvTri}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {initiative.tcEd}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {initiative.rrOe}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {initiative.crSla}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {initiative.jobSize}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {initiative.calculatedCoD?.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600 dark:text-blue-400">
                {initiative.calculatedWsjf?.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onDelete(initiative.id)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
// --- End of InitiativesTable Component ---


// --- Main Home Component ---
const defaultWeights: CoDWeights = {
  wUvTri: 3,
  wTcEd: 2,
  wRrOe: 2,
  wCrSla: 1,
};

const Home: React.FC = () => {
  const [weights, setWeights] = useState<CoDWeights>(defaultWeights);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const pdfContentRef = useRef<HTMLDivElement>(null);

  // Effect to re-calculate WSJF when weights or initiatives change
  useEffect(() => {
    // Recalculate CoD and WSJF for all initiatives
    const updatedInitiatives = initiatives.map(init => {
      const calculatedCoD = calculateCoD(init, weights);
      const calculatedWsjf = calculateWsjf(calculatedCoD, init.jobSize);
      return { ...init, calculatedCoD, calculatedWsjf };
    });
    // Sort by WSJF in descending order (highest priority first)
    const sortedInitiatives = updatedInitiatives.sort((a, b) => (b.calculatedWsjf || 0) - (a.calculatedWsjf || 0));
    setInitiatives(sortedInitiatives);
  }, [weights, initiatives.length]); // Dependencies: re-run if weights change or initiative count changes

  const handleAddInitiative = (newInitiative: Omit<Initiative, 'id' | 'calculatedCoD' | 'calculatedWsjf'>) => {
    const id = uuidv4();
    const calculatedCoD = calculateCoD(newInitiative, weights);
    const calculatedWsjf = calculateWsjf(calculatedCoD, newInitiative.jobSize);
    setInitiatives(prev => [...prev, { ...newInitiative, id, calculatedCoD, calculatedWsjf }]);
  };

  const handleDeleteInitiative = (id: string) => {
    setInitiatives(prev => prev.filter(init => init.id !== id));
  };

  const handleExportPdf = () => {
    if (pdfContentRef.current) {
      const element = pdfContentRef.current;
      const options = {
        margin: 0.5,
        filename: 'wsjf_prioritization_report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      // Create a temporary div for PDF content to add header and weights
      const pdfWrapper = document.createElement('div');
      // Apply some basic styles for the PDF header that html2pdf can interpret
      pdfWrapper.style.fontFamily = 'sans-serif';
      pdfWrapper.style.padding = '20px';

      pdfWrapper.innerHTML = `
        <h1 style="text-align: center; margin-bottom: 20px; font-size: 24px; font-weight: bold; color: #333;">Weighted Shortest Job First (WSJF) Prioritization Report</h1>
        <div style="margin-bottom: 30px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="font-size: 18px; margin-bottom: 10px; color: #555;">Configured Weights:</h2>
          <p style="margin-bottom: 5px; color: #666;">User Value / Training Readiness Impact (UV/TRI) Weight: <strong style="color: #333;">${weights.wUvTri}</strong></p>
          <p style="margin-bottom: 5px; color: #666;">Time Criticality / Event Dependency (TC/ED) Weight: <strong style="color: #333;">${weights.wTcEd}</strong></p>
          <p style="margin-bottom: 5px; color: #666;">Risk Reduction / Opportunity Enablement (RR/OE) Weight: <strong style="color: #333;">${weights.wRrOe}</strong></p>
          <p style="margin-bottom: 5px; color: #666;">Compliance / Regulatory / SLA (CR/SLA) Weight: <strong style="color: #333;">${weights.wCrSla}</strong></p>
        </div>
        ${element.innerHTML}
      `;

      html2pdf().set(options).from(pdfWrapper).save();
    }
  };

  return (
    <div className="min-h-screen p-8 transition-colors duration-200 bg-gray-100 dark:bg-darkBg text-gray-900 dark:text-darkText">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-extrabold text-blue-700 dark:text-blue-400">WSJF Calculator</h1>
        <DarkModeToggle />
      </header>

      <section className="mb-8 p-6 rounded-lg shadow-xl bg-white dark:bg-darkCard">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Define Cost of Delay Weights</h2>
        <WeightsConfiguration weights={weights} setWeights={setWeights} />
      </section>

      <section className="mb-8 p-6 rounded-lg shadow-xl bg-white dark:bg-darkCard">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Add New Initiative</h2>
        <InitiativeInputForm onAdd={handleAddInitiative} />
      </section>

      <section className="mb-8 p-6 rounded-lg shadow-xl bg-white dark:bg-darkCard">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Prioritized Initiatives</h2>
        {/* This div will be captured for the PDF export */}
        <div ref={pdfContentRef}>
          <InitiativesTable initiatives={initiatives} onDelete={handleDeleteInitiative} />
        </div>
        <button
          onClick={handleExportPdf}
          className="mt-6 px-8 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-darkBg"
        >
          Export to PDF Report
        </button>
      </section>

      <footer className="text-center text-gray-500 dark:text-gray-400 text-sm mt-10">
        <p>&copy; {new Date().getFullYear()} WSJF Calculator. All rights reserved.</p>
        <p>Prioritize to minimize service member time and maximize impact.</p>
      </footer>
    </div>
  );
};

export default Home;
