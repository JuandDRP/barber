import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { DisponibilidadBarberos } from './componentes/DisponibilidadBarberos';
import { ResumenBarberia } from './componentes/ResumenBarberia';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-2xl font-bold text-center mb-8">Barberia Luxury</h1>
        <Routes>
          <Route path="/" element={<DisponibilidadBarberos />} />
          <Route path="/resumen" element={<ResumenBarberia />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
