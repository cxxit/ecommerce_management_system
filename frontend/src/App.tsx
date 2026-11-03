import type { Theme } from './settings/types';
import { NexusSignup } from './components/NexusSignup';

let theme: Theme = 'light';

function App() {
  function setTheme(theme: Theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setTheme(theme);

  return <NexusSignup />;
}

export default App;
