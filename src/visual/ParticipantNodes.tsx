import { useEventStore } from '../stores/useEventStore';

export default function ParticipantNodes() {
  const { participants } = useEventStore();
  const nodes = Object.values(participants);
  
  if (nodes.length === 0) return null;

  return (
    <div className="absolute bottom-[10%] left-0 right-0 flex justify-center items-end gap-4 md:gap-8 lg:gap-12 px-12 z-20">
      {nodes.map(node => {
        const isConfirmed = node.status === 'CONFIRMED';
        
        return (
          <div key={node.id} className="flex flex-col items-center">
            {/* Visual Node */}
            <div className={`relative rounded-full transition-all duration-500 ease-out flex items-center justify-center
              ${isConfirmed 
                ? 'w-24 h-24 md:w-32 md:h-32 bg-gab-cyan-light shadow-[0_0_40px_rgba(91,192,190,0.8)] scale-110' 
                : 'w-16 h-16 md:w-24 md:h-24 border-2 border-gab-cyan opacity-50 scale-100'
              }`}
            >
              {/* Inner core when confirmed */}
              {isConfirmed && (
                <div className="w-1/2 h-1/2 bg-white rounded-full shadow-[0_0_20px_white] animate-pulse"></div>
              )}
              
              {/* Connecting line visualization when confirmed */}
              {isConfirmed && (
                <div className="absolute top-0 left-1/2 w-[2px] h-[200px] bg-gradient-to-t from-gab-cyan-light to-transparent -translate-x-1/2 -translate-y-full opacity-60"></div>
              )}
            </div>
            
            <p className={`mt-4 font-mono text-sm tracking-widest ${isConfirmed ? 'text-gab-cyan-light font-bold' : 'text-gray-500'}`}>
              KLG {node.id.toString().padStart(2, '0')}
            </p>
          </div>
        );
      })}
    </div>
  );
}
