# WSJFv2 - WSJF Calculator

A modern, responsive WSJF (Weighted Shortest Job First) Calculator built with Next.js, TypeScript, and Tailwind CSS. This tool helps prioritize initiatives using the WSJF framework with customizable Cost of Delay weights.

## Features

- **Interactive WSJF Calculation**: Real-time calculation of Cost of Delay and WSJF scores
- **Customizable Weights**: Adjust weights for different Cost of Delay factors
- **Dark Mode Support**: Toggle between light and dark themes
- **PDF Export**: Generate professional prioritization reports
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **TypeScript**: Fully typed for better development experience

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd wsjfv2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

1. **Build the project locally** (optional but recommended)
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   - Push your code to GitHub
   - Connect your GitHub repository to Vercel
   - Vercel will automatically build and deploy

## Project Structure

```
├── pages/
│   ├── _app.tsx          # Next.js app component
│   ├── _document.tsx     # Custom document
│   └── index.tsx         # Main WSJF calculator
├── styles/
│   └── globals.css       # Global styles with Tailwind
├── package.json          # Dependencies and scripts
├── next.config.mjs       # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## Usage

1. **Configure Weights**: Set the importance weights for each Cost of Delay factor
2. **Add Initiatives**: Input initiatives with their scores and job sizes
3. **View Results**: See automatically calculated and sorted WSJF priorities
4. **Export Report**: Generate a PDF report of your prioritization

## Cost of Delay Factors

- **UV/TRI**: User Value / Training Readiness Impact
- **TC/ED**: Time Criticality / Event Dependency  
- **RR/OE**: Risk Reduction / Opportunity Enablement
- **CR/SLA**: Compliance / Regulatory / SLA

## Technologies Used

- **Next.js 14**: React framework for production
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **jsPDF**: PDF generation
- **jsPDF AutoTable**: Table formatting for PDFs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is private and proprietary.
