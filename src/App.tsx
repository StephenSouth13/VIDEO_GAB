import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LedStage from './visual/LedStage';
import OperatorPanel from './operator/OperatorPanel';
import { useEffect } from 'react';
import { eventController } from './core/EventController';
import { KeyboardSensorAdapter } from './sensors/SensorAdapter';
import TimelineManager from './core/TimelineManager';

function OperatorRoute() {
  useEffect(() => {
    eventController.boot();
    const keyboardSensor = new KeyboardSensorAdapter();
    keyboardSensor.connect();
    
    return () => keyboardSensor.disconnect();
  }, []);

  return (
    <>
      <OperatorPanel />
      <TimelineManager />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/led" element={<LedStage />} />
        <Route path="/operator" element={<OperatorRoute />} />
        <Route path="*" element={<Navigate to="/operator" />} />
      </Routes>
    </Router>
  );
}

export default App;
