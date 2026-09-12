import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LedStage from './visual/LedStage';
import OperatorPanel from './operator/OperatorPanel';
import { useEffect } from 'react';
import { eventController } from './core/EventController';
import { KeyboardSensorAdapter } from './sensors/SensorAdapter';
import TimelineManager from './core/TimelineManager';
import AudioConductor from './audio/AudioConductor';

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
      <AudioConductor />
    </>
  );
}

function LedRoute() {
  return (
    <>
      <LedStage />
      <TimelineManager />
      <AudioConductor />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/led" element={<LedRoute />} />
        <Route path="/operator" element={<OperatorRoute />} />
        <Route path="*" element={<Navigate to="/operator" />} />
      </Routes>
    </Router>
  );
}

export default App;
