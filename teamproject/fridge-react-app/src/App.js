import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RefrigeratorPage from './fridge/RefrigeratorPage';
import { FridgeProvider } from './fridge/contexts/FridgeContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <FridgeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RefrigeratorPage />} />
          </Routes>
        </BrowserRouter>
      </FridgeProvider>
    </DndProvider>
  );
}

export default App;
