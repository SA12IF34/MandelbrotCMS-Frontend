import './Style.css';
import '../../styles/index.css'

import { ThemeContextProvider } from './context/ThemeContext';
import App from './App';

function Main() {

  return (
    <ThemeContextProvider>
        <App />
    </ThemeContextProvider>
  )
}

export default Main