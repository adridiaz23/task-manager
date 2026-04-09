// main.jsx — punto de entrada
// React necesita este fichero para "montar" tu app en el HTML
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// getElementById('root') busca el <div id="root"> en index.html
// createRoot + render es la forma moderna (React 18+) de iniciar la app
ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode es una herramienta de desarrollo: detecta posibles
  // errores y malas prácticas. No afecta al usuario final.
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)