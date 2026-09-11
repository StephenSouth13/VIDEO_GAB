import { motion } from 'framer-motion';
import { useEventStore } from '../stores/useEventStore';

type LayoutKeys = 'countdown' | 'logo' | 'counter' | 'finalMessage' | 'cardVietkings' | 'cardGAB';

interface Props {
  layoutKey: LayoutKeys;
  children: React.ReactNode;
  className?: string;
  isEndPos?: boolean;
}

export default function DraggableItem({ layoutKey, children, className, isEndPos }: Props) {
  const layout = useEventStore(state => state.layout[layoutKey]) as any;
  const updateLayout = useEventStore(state => state.updateLayout);
  
  const isEditMode = new URLSearchParams(window.location.search).get('edit') === 'true';

  const x = isEndPos ? (layout?.endX ?? 0) : (layout?.x ?? 0);
  const y = isEndPos ? (layout?.endY ?? 0) : (layout?.y ?? 0);

  return (
    <motion.div
      drag={isEditMode}
      dragMomentum={false}
      onDragEnd={(_e, info) => {
        if (!isEditMode) return;
        if (isEndPos) {
          updateLayout(layoutKey, {
            endX: x + info.offset.x,
            endY: y + info.offset.y
          });
        } else {
          updateLayout(layoutKey, {
            x: x + info.offset.x,
            y: y + info.offset.y
          });
        }
      }}
      className={`absolute ${className || ''} ${isEditMode ? 'cursor-move hover:ring-2 hover:ring-gab-cyan' : ''}`}
      style={{
        left: '50%',
        top: '50%',
        x: `calc(-50% + ${x}px)`,
        y: `calc(-50% + ${y}px)`,
        scale: layout?.scale ?? 1
      }}
    >
       {children}
    </motion.div>
  );
}

