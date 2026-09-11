import { useEventStore, EventPhase } from '../stores/useEventStore';
import { eventController } from '../core/EventController';

export default function OperatorPanel() {
  const { phase, requiredParticipants, participants, isBlackout } = useEventStore();
  
  const handleActivateAll = () => {
    eventController.activateAll();
  };
  
  const handleReset = () => {
    eventController.resetEvent();
  };
  
  const handleConfirm = (id: number) => {
    eventController.confirmParticipant(id);
  };
  
  const participantsArray = Object.values(participants);
  const confirmedCount = participantsArray.filter(p => p.status === 'CONFIRMED').length;

  return (
    <div className="min-h-screen bg-gab-navy text-white p-6">
      <header className="mb-8 border-b border-gab-cyan pb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gab-cyan-light">GAB Operator Control Panel</h1>
        <div className="flex gap-4">
           <button 
            onClick={() => eventController.toggleBlackout()} 
            className={`px-4 py-2 font-bold rounded ${isBlackout ? 'bg-red-600' : 'bg-gray-700'}`}
          >
            {isBlackout ? 'RESTORE LED' : 'BLACKOUT (B)'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Status Panel */}
        <div className="bg-gab-blue p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gab-cyan-light">Event Status</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm">Current Phase</p>
              <p className="text-xl font-mono text-gab-electric">{phase}</p>
            </div>
            
            <div>
              <p className="text-gray-400 text-sm">Participants Ready</p>
              <p className="text-2xl font-bold">
                {confirmedCount} <span className="text-gray-500">/ {requiredParticipants}</span>
              </p>
            </div>
            
            <div className="pt-4 flex flex-col gap-2 border-t border-gab-cyan">
              <button 
                onClick={handleActivateAll}
                className="w-full py-2 bg-gab-cyan-light text-gab-navy font-bold rounded hover:bg-white transition"
              >
                ACTIVATE ALL (A)
              </button>
              
              <button 
                onClick={() => eventController.skipToNextPhase()}
                className="w-full py-2 bg-gab-cyan text-white font-bold rounded hover:bg-gab-cyan-light transition"
              >
                SKIP PHASE (Space)
              </button>
              
              <button 
                onClick={handleReset}
                className="w-full py-2 border border-red-500 text-red-500 font-bold rounded hover:bg-red-500 hover:text-white transition"
              >
                RESET EVENT (Z)
              </button>
            </div>
          </div>
        </div>

        {/* Participants Panel */}
        <div className="md:col-span-2 bg-gab-blue p-6 rounded-lg shadow-lg">
           <h2 className="text-xl font-semibold mb-4 text-gab-cyan-light">Sensors / Participants</h2>
           
           <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {participantsArray.map(p => (
                <div 
                  key={p.id} 
                  className={`p-4 rounded-lg text-center border-2 transition ${
                    p.status === 'CONFIRMED' 
                      ? 'bg-gab-cyan-light bg-opacity-20 border-gab-cyan-light text-gab-cyan-light' 
                      : 'bg-gab-navy border-gab-cyan text-gray-400'
                  }`}
                >
                  <p className="font-bold text-lg mb-2">KLG {p.id.toString().padStart(2, '0')}</p>
                  <p className="text-xs mb-3">{p.status}</p>
                  <button 
                    onClick={() => handleConfirm(p.id)}
                    disabled={p.status === 'CONFIRMED'}
                    className="text-xs px-3 py-1 bg-gab-cyan rounded hover:bg-gab-cyan-light text-white disabled:opacity-50"
                  >
                    ACTIVATE
                  </button>
                </div>
              ))}
           </div>
        </div>
        
      </div>
      
      <footer className="mt-8 text-center text-gray-500 text-sm">
         URL cho LED: <a href="/led" target="_blank" className="text-gab-cyan-light underline">http://localhost:5173/led</a>
         <p className="mt-2">Lưu ý: Bấm F11 để Fullscreen cửa sổ LED</p>
      </footer>
    </div>
  );
}
