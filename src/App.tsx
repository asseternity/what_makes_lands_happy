import './index.css';
import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';
import { HeaderSearch } from './components/HeaderSearch';
import MainContent from './components/MainContent';

const theme = createTheme({
  fontFamily: 'Arial Black',
  primaryColor: 'green',
});

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <HeaderSearch />
      <MainContent />
    </MantineProvider>
  );
}
