import { useEventStore } from '../stores/useEventStore';

export default function ParticipantNodes() {
  const { participants, nodeShape } = useEventStore();
  const nodes = Object.values(participants);
  
  if (nodes.length === 0) return null;

  return (
    <div className="absolute bottom-[8%] left-0 right-0 flex justify-evenly items-end px-2 md:px-12 z-20 w-full overflow-hidden">
      {nodes.map(node => {
        const isConfirmed = node.status === 'CONFIRMED';
        
        if (!node.name || node.name.trim() === '') {
          return <div key={node.id} className={`flex flex-col items-center opacity-0 pointer-events-none ${nodeShape === 'circle' ? 'w-[8%]' : 'w-[6%] md:w-[5%]'}`}></div>;
        }

        return (
          <div key={node.id} className={`flex flex-col items-center ${nodeShape === 'circle' ? 'max-w-[8%]' : 'w-[6%] md:w-[5%]'}`}>
            {/* Visual Node */}
            <div className={`relative transition-all duration-500 ease-out flex items-center justify-center
              ${nodeShape === 'rectangle' ? 'w-full aspect-[1/2.2] rounded-sm' : 'rounded-full aspect-square ' + (isConfirmed ? 'w-12 h-12 md:w-20 md:h-20' : 'w-10 h-10 md:w-16 md:h-16')}
              ${isConfirmed 
                ? 'bg-yellow-400/20 border-4 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.8)] scale-110' 
                : 'border-2 border-yellow-500/50 opacity-50 scale-100'
              }`}
            >
              {/* Inner core when confirmed */}
              {isConfirmed && (
                <div className={`${nodeShape === 'rectangle' ? 'w-1/3 h-1/3 rounded-sm' : 'w-1/2 h-1/2 rounded-full'} bg-yellow-200 shadow-[0_0_20px_white] animate-pulse`}></div>
              )}
              
              {/* Connecting line visualization when confirmed */}
              {isConfirmed && (
                <div className="absolute top-0 left-1/2 w-[4px] h-[200px] bg-gradient-to-t from-yellow-400 to-transparent -translate-x-1/2 -translate-y-full opacity-60"></div>
              )}
            </div>
            
            <p className={`mt-2 md:mt-4 font-sans tracking-wider whitespace-nowrap text-center uppercase leading-tight ${nodeShape === 'rectangle' ? 'text-[9px] md:text-sm' : 'text-[10px] md:text-xs'} ${isConfirmed ? 'text-yellow-400 font-bold drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]' : 'text-gray-400'}`}>
              {node.name}
            </p>
          </div>
        );
      })}
    </div>
  );
}
