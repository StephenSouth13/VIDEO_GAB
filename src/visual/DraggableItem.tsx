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
  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

  return (
    <motion.div
      drag={isEditMode}
      dragMomentum={false}
      onDragEnd={(_e, info) => {
        if (!isEditMode) return;
        if (isEndPos) {
          updateLayout(layoutKey, {
            endX: clamp(x + info.offset.x, -1500, 1500),
            endY: clamp(y + info.offset.y, -520, 520)
          });
        } else {
          updateLayout(layoutKey, {
            x: clamp(x + info.offset.x, -1500, 1500),
            y: clamp(y + info.offset.y, -520, 520)
          });
        }
      }}
      className={`absolute ${className || ''} ${isEditMode ? 'cursor-move hover:ring-2 hover:ring-gab-cyan' : ''}`}
      style={{
        left: '50%',
        top: '50%',
        x: `calc(-50% + ${clamp(x, -1500, 1500)}px)`,
        y: `calc(-50% + ${clamp(y, -520, 520)}px)`,
        scale: layout?.scale ?? 1,
        pointerEvents: isEditMode ? 'auto' : undefined
      }}
    >
       {children}
    </motion.div>
  );
}
