// types/jspdf.d.ts
declare module 'jspdf' {
  export class jsPDF {
    constructor(orientation?: string, unit?: string, format?: string | number[]);
    
    setFontSize(size: number): void;
    text(text: string, x: number, y: number): void;
    save(filename: string): void;
    
    autoTable(options: {
      head?: any[][];
      body?: any[][];
      startY?: number;
      styles?: any;
      headStyles?: any;
      alternateRowStyles?: any;
      columnStyles?: any;
    }): void;
  }
}

declare module 'jspdf-autotable' {
  const autoTable: any;
  export default autoTable;
}
