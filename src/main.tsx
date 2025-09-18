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

// [v] dummy db: export what I already have in HDS here
// [v] research ui inspirations
// perfect insp: https://dribbble.com/shots/24320666-slothUI-World-s-Laziest-Design-System-Demographics-Dashboard
// [v] research ui kits, pick one to learn: tailwind
// [v] install typescript extensions for VSC
// [v] deconstruct default vite landing page
// [_] construct a dummy ui frontend with tailwind
// [_] import json to frontend
// [_] get a piece of paper and a pencil to draw / iterate the ui
// (use these always)
// [_] make the UI in typescript
// [_] read on typescript and take notes
// [_] iterate the ui until it is 'okay'
// [_] switch to dotnet backend
// [_] make a postgreSQL db in the dotnet backend
// [_] finish NDS, export to postgresql
// [_] publish backend via railway
// [_] connect backend and frontend via api calls
// [_] finish NDS data science project
// [_] publish NDS
// [_] publish this project
