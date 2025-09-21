import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// features:
// - landing page
// - happiness colored map
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
// [_] understand WHERE to use TS here | or in my other projects (incorporate to other projects!)
// [_] now just USE TypeScript stuff to get handy with it! make the UI in typescript until it's good
// [_] write readme, host on GH pages

// --- NDS ---

// [_] finish NDS data science project
// [_] publish NDS

// --- DOTNET ---

// [_] do a dotnet backend
// [_] make a postgreSQL db in the dotnet backend
// [_] put dummy NDS into postgresql
// [_] publish backend via railway
// [_] connect backend and frontend via api calls

// [_] publish this project
