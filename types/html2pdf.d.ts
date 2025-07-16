// types/html2pdf.d.ts

// This declares the module 'html2pdf.js' so TypeScript knows it exists.
// It uses a minimal definition for its common usage.
declare module 'html2pdf.js' {
  interface html2pdf {
    (element?: HTMLElement | string, opt?: html2pdf.Options): html2pdf.Worker;
    Worker: html2pdf.Worker; // Allows new html2pdf.Worker()
    // Add other top-level methods if needed, e.g.,
    // set: (opt: html2pdf.Options) => html2pdf.Worker;
    // from: (source: any, type?: 'string' | 'element' | 'canvas' | 'img') => html2pdf.Worker;
    // toPdf: () => html2pdf.Worker;
    // save: (filename?: string) => html2pdf.Worker;
  }

  namespace html2pdf {
    interface Options {
      margin?: number | number[];
      filename?: string;
      image?: { type: string; quality: number };
      html2canvas?: {
        scale?: number;
        logging?: boolean;
        letterRendering?: boolean;
        useCORS?: boolean;
        // ... any other html2canvas options you might use
      };
      jsPDF?: {
        unit?: string;
        format?: string | number[];
        orientation?: 'portrait' | 'landscape';
        // ... any other jsPDF options you might use
      };
      pagebreak?: {
        mode?: 'css' | 'legacy' | 'avoid-all' | 'all';
        before?: string[];
        after?: string[];
        avoid?: string[];
      };
      // For the Worker API chain
      [key: string]: any; // Catch-all for unknown properties during chaining
    }

    interface Worker {
      from(source: HTMLElement | string, type?: 'string' | 'element' | 'canvas' | 'img'): Worker;
      to(target: 'container' | 'canvas' | 'img' | 'pdf'): Worker;
      output(type?: string, options?: any, source?: 'pdf' | 'img'): any;
      save(filename?: string): Promise<void>;
      set(opt: Options): Worker;
      get(key: string, cbk: (value: any) => void): Worker;
      // You can add more chained methods if you use them, e.g.:
      // toPdf: () => Worker;
      // toImg: () => Worker;
      // toCanvas: () => Worker;
      // toContainer: () => Worker;
      // Using 'any' for simplicity; refine as you use more methods
      [key: string]: any;
    }
  }

  const html2pdf: html2pdf;
  export = html2pdf;
}
