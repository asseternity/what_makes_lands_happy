import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Minimal Viable Product (MVP):
// - Cleaned, merged PostgreSQL dataset with provenance.
// - React + TypeScript dashboard: choropleth/map, correlation chart, country detail view.
// - .NET API serving filtered queries and basic correlation endpoints.
// - Jest/Vitest tests for critical UI components and one backend logic test.

// features:
// - landing page with a happiness colored map
// - searching for a country
// - country profiles with strength and weaknesses breakdown
// - detailed data view: big table with analysis of means and medians, etc

// --- SETUP ---

// [v] dummy db: export what I already have in HDS here
// [v] research ui inspirations
// perfect insp: https://dribbble.com/shots/24320666-slothUI-World-s-Laziest-Design-System-Demographics-Dashboard
// [v] research ui kits, pick one to learn: mantine
// [v] install typescript extensions for VSC
// [v] deconstruct default vite landing page
// [v] import json to frontend
// [v] install and try mantine
// [v] construct a dummy ui frontend with mantine

// --- LEARNING ---

// [v] read on TypeScript, learn TS fully: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
// - what is typescript for? so far in this TSX project there have been no differences with JS
// - is every JS code also TSX code?
// - take notes
// [v] read on Mantine
// [v] switch to Shadcn - fill my notes
// [v] should shadcn go with something else - radix or tailwind?
// [v] learn tailwind CSS
// [v] learn radix UI
// [v] navigation to different pages with Shadcn?

// --- FRONTEND ---

// [v] play around, make something with TS + Shadcn
// [v] get a piece of paper and a pencil to draw / iterate the ui (use these always)
// [v] all cards at once for big screens
// [v] narrower "about" for big screens
// [v] finish frontend
// [v] add new cool features to practice all the typescript stuff!
// [v] host on GH pages
// [v] now just USE TypeScript stuff to get handy with it! make the UI in typescript until it's good
// [v] country profile popup
// [v] ui feedback
// [v] use this for UI colors: https://coolors.co/palettes/trending !!!
// [v] make minimal fixes to NDS data science project - fix missing data, add a couple more tables
// [v] re-export NDS data science project
// [v] *** do the expected weights calculations HERE - in TS!!! ***
// [v] show numbers in cards and profiles
// [v] improve uis
// [v] replace accordion with real info
// [v] practice typescript by looking up typescript stuff and adding even more features
// [v] make the strength / weaknesses WEIGHTED by how much it affects happiness!
// [v] choropleth the map with happiness numbers
// [v] write readme
// [v] animations for N/A countries too
// [v] plans: replace "strength" and "weakness" in cards and profile with CLEAR charts:
// - explaining the methodology (CLARITY)
// - showing the ourliers for the country (DATA SCIENCE)
// tools:
// https://medium.com/@asyncme/a-guide-to-creating-charts-in-react-with-typescript-8ac9fd17fa74
// - Chart.js: A powerful, simple, and flexible charting library.
// - Recharts: Built on top of D3.js for React.
// - Victory: Declarative charting library for React.
// [v] replace "strength" and "weakness" outliers with: add "our country's value" and "expected value for our happiness" to absoluteStatistics
// [v] show graphs, pretty UI
// [_] finalize graphs (3 cards), pretty UI
// [_] CLARIFY!!! explain CLEARLY what the methodology is
// [_] jest/vitest for: map click callback (sets selected country); search functions; cards rendering correct data

// --- NDS ---

// [_] add turkey and US
// [_] finish NDS data science project
// [_] add sources
// [_] publish NDS

// --- DOTNET ---

// [_] do a dotnet backend
// [_] make a postgreSQL db in the dotnet backend
// [_] put dummy NDS into postgresql
// [_] publish backend via railway
// [_] connect backend and frontend via api calls

// [_] publish this project
