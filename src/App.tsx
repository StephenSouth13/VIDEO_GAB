import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LedStage from './visual/LedStage';
import OperatorPanel from './operator/OperatorPanel';
import { useEffect } from 'react';
import { eventController } from './core/EventController';
import { KeyboardSensorAdapter } from './sensors/SensorAdapter';

function App() {
  useEffect(() => {
    eventController.boot();
    const keyboardSensor = new KeyboardSensorAdapter();
    keyboardSensor.connect();
    
    return () => keyboardSensor.disconnect();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/led" element={<LedStage />} />
        <Route path="/operator" element={<OperatorPanel />} />
        <Route path="*" element={<Navigate to="/operator" />} />
      </Routes>
    </Router>
  );
}

export default App;
