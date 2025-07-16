// pages/index.tsx
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// --- Interfaces and Calculation Utilities ---
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
  id: string;
  name: string;
  jobSize: number;
  calculatedCoD?: number;
  calculatedWsjf?: number;
}

export const calculateCoD = (scores: CoDScores, weights: CoDWeights): number => {
  const { uvTri, tcEd, rrOe, crSla } = scores;
  const { wUvTri, wTcEd, wRrOe, wCrSla } = weights;
  return (uvTri * wUvTri) + (tcEd * wTcEd) + (rrOe * wRrOe) + (crSla * wCrSla);
};

export const calculateWsjf = (CoD: number, jobSize: number): number => {
  return jobSize > 0 ? CoD / jobSize : 0;
};

// --- DarkModeToggle Component ---
const DarkModeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', newMode);
    }
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

// --- WeightsConfiguration Component ---
interface WeightsConfigurationProps {
  weights: CoDWeights;
  setWeights: React.Dispatch<React.SetStateAction<CoDWeights>>;
}

const WeightsConfiguration: React.FC<WeightsConfigurationProps> = ({ weights, setWeights }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWeights(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const weightFields = [
    { label: 'User Value / Training Readiness Impact (UV/TRI) Weight', name: 'wUvTri', value: weights.wUvTri },
    { label: 'Time Criticality / Event Dependency (TC/ED) Weight', name: 'wTcEd', value: weights.wTcEd },
    { label: 'Risk Reduction / Opportunity Enablement (RR/OE) Weight', name: 'wRrOe', value: weights.wRrOe },
    { label: 'Compliance / Regulatory / SLA (CR/SLA) Weight', name: 'wCrSla', value: weights.wCrSla },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {weightFields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label htmlFor={field.name} className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
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

// --- InitiativeInputForm Component ---
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
    { label: 'User Value / Training Readiness Impact (1-10)', value: uvTri, setter: setUvTri },
    { label: 'Time Criticality / Event Dependency (1-10)', value: tcEd, setter: setTcEd },
    { label: 'Risk Reduction / Opportunity Enablement (1-10)', value: rrOe, setter: setRrOe },
    { label: 'Compliance / Regulatory / SLA (1-10)', value: crSla, setter: setCrSla },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="initiativeName" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
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
            <label htmlFor={field.label.replace(/\s/g, '')} className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              {field.label}: {field.value}
            </label>
            <input
              type="range"
              id={field.label.replace(/\s/g, '')}
              min="1"
              max="10"
              value={field.value}
              onChange={(e) => field.setter(parseInt(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-600"
            />
          </div>
        ))}
      </div>

      <div>
        <label htmlFor="jobSize" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Job Size (Story Points): {jobSize}
        </label>
        <input
          type="range"
          id="jobSize"
          min="1"
          max="20"
          value={jobSize}
          onChange={(e) => setJobSize(parseInt(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-600"
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

// --- InitiativesTable Component ---
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
  const [isExporting, setIsExporting] = useState(false);

  // Effect to re-calculate WSJF when weights or initiatives change
  useEffect(() => {
    if (initiatives.length === 0) return;
    
    const updatedInitiatives = initiatives.map(init => {
      const calculatedCoD = calculateCoD(init, weights);
      const calculatedWsjf = calculateWsjf(calculatedCoD, init.jobSize);
      return { ...init, calculatedCoD, calculatedWsjf };
    });
    const sortedInitiatives = updatedInitiatives.sort((a, b) => (b.calculatedWsjf || 0) - (a.calculatedWsjf || 0));
    setInitiatives(sortedInitiatives);
  }, [weights]);

  const handleAddInitiative = (newInitiative: Omit<Initiative, 'id' | 'calculatedCoD' | 'calculatedWsjf'>) => {
    const id = uuidv4();
    const calculatedCoD = calculateCoD(newInitiative, weights);
    const calculatedWsjf = calculateWsjf(calculatedCoD, newInitiative.jobSize);
    const newInitWithCalcs = { ...newInitiative, id, calculatedCoD, calculatedWsjf };
    
    setInitiatives(prev => {
      const updated = [...prev, newInitWithCalcs];
      return updated.sort((a, b) => (b.calculatedWsjf || 0) - (a.calculatedWsjf || 0));
    });
  };

  const handleDeleteInitiative = (id: string) => {
    setInitiatives(prev => prev.filter(init => init.id !== id));
  };

  const handleExportPdf = async () => {
    if (initiatives.length === 0) {
      alert('No initiatives to export. Please add some initiatives first.');
      return;
    }

    setIsExporting(true);
    
    try {
      // Check if we're in the browser environment
      if (typeof window === 'undefined') {
        throw new Error('PDF export is only available in the browser');
      }

      // Dynamic imports to avoid SSR issues - using proper typing
      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default;
      
      // Import autoTable plugin
      const autoTableModule = await import('jspdf-autotable');
      
      // Create new PDF instance
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text('WSJF Prioritization Report', 14, 22);
      
      // Add timestamp
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      
      // Add weights section
      doc.setFontSize(12);
      doc.text('Configured Weights:', 14, 40);
      doc.setFontSize(10);
      doc.text(`User Value / Training Readiness Impact (UV/TRI): ${weights.wUvTri}`, 14, 47);
      doc.text(`Time Criticality / Event Dependency (TC/ED): ${weights.wTcEd}`, 14, 52);
      doc.text(`Risk Reduction / Opportunity Enablement (RR/OE): ${weights.wRrOe}`, 14, 57);
      doc.text(`Compliance / Regulatory / SLA (CR/SLA): ${weights.wCrSla}`, 14, 62);
      
      // Prepare table data
      const tableData = initiatives.map((init, index) => [
        (index + 1).toString(),
        init.name,
        init.uvTri.toString(),
        init.tcEd.toString(),
        init.rrOe.toString(),
        init.crSla.toString(),
        init.jobSize.toString(),
        init.calculatedCoD?.toFixed(2) || '0',
        init.calculatedWsjf?.toFixed(2) || '0'
      ]);
      
      // Add table using autoTable - check if method exists
      if (typeof (doc as any).autoTable === 'function') {
        (doc as any).autoTable({
          head: [['Rank', 'Initiative', 'UV/TRI', 'TC/ED', 'RR/OE', 'CR/SLA', 'Job Size', 'CoD', 'WSJF']],
          body: tableData,
          startY: 70,
          styles: { 
            fontSize: 8,
            cellPadding: 2
          },
          headStyles: { 
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold'
          },
          alternateRowStyles: { 
            fillColor: [245, 245, 245] 
          },
          columnStyles: {
            0: { halign: 'center', cellWidth: 15 },
            1: { cellWidth: 40 },
            2: { halign: 'center', cellWidth: 15 },
            3: { halign: 'center', cellWidth: 15 },
            4: { halign: 'center', cellWidth: 15 },
            5: { halign: 'center', cellWidth: 15 },
            6: { halign: 'center', cellWidth: 20 },
            7: { halign: 'center', cellWidth: 20 },
            8: { halign: 'center', cellWidth: 20 }
          }
        });
      } else {
        // Fallback: add table data as text if autoTable fails
        let yPosition = 70;
        doc.setFontSize(8);
        doc.text('Rank | Initiative | UV/TRI | TC/ED | RR/OE | CR/SLA | Job Size | CoD | WSJF', 14, yPosition);
        yPosition += 5;
        
        tableData.forEach((row) => {
          const rowText = row.join(' | ');
          doc.text(rowText, 14, yPosition);
          yPosition += 4;
          if (yPosition > 280) { // Add new page if needed
            doc.addPage();
            yPosition = 20;
          }
        });
      }
      
      // Save the PDF
      doc.save(`wsjf_prioritization_report_${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      
      // Provide more specific error messaging
      if (error instanceof Error) {
        if (error.message.includes('browser')) {
          alert('PDF export is only available when running in the browser.');
        } else if (error.message.includes('import') || error.message.includes('module')) {
          alert('Failed to load PDF libraries. Please try refreshing the page.');
        } else {
          alert(`Failed to generate PDF: ${error.message}`);
        }
      } else {
        alert('Failed to generate PDF. Please try again or check the browser console for details.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen p-8 transition-colors duration-200 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-extrabold text-blue-700 dark:text-blue-400">WSJF Calculator</h1>
        <DarkModeToggle />
      </header>

      <section className="mb-8 p-6 rounded-lg shadow-xl bg-white dark:bg-gray-800">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Define Cost of Delay Weights</h2>
        <WeightsConfiguration weights={weights} setWeights={setWeights} />
      </section>

      <section className="mb-8 p-6 rounded-lg shadow-xl bg-white dark:bg-gray-800">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Add New Initiative</h2>
        <InitiativeInputForm onAdd={handleAddInitiative} />
      </section>

      <section className="mb-8 p-6 rounded-lg shadow-xl bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold border-b pb-2 border-gray-200 dark:border-gray-700">Prioritized Initiatives</h2>
          <button
            onClick={handleExportPdf}
            disabled={isExporting || initiatives.length === 0}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isExporting ? 'Generating PDF...' : 'Export to PDF'}
          </button>
        </div>
        <InitiativesTable initiatives={initiatives} onDelete={handleDeleteInitiative} />
      </section>

      <footer className="text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>WSJF Calculator - Prioritize initiatives using Weighted Shortest Job First methodology</p>
      </footer>
    </div>
  );
};

export default Home;
