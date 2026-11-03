
import { NexusSignup } from './components/NexusSignup';
import theme from './settings/theme.ts';

function App() {
  function setTheme(config: {
    theme: 'light' | 'dark';
    container: 'centered' | 'none';
  }) {
    if (config.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setTheme(theme);

  return <NexusSignup />;
}

export default App;
