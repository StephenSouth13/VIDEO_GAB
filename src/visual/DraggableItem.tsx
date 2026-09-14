import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useEventStore } from '../stores/useEventStore';

type LayoutKeys =
  | 'countdown'
  | 'nodes'
  | 'logo'
  | 'revealLogo'
  | 'centerFinalLogo'
  | 'counter'
  | 'finalMessage'
  | 'cardVietkings'
  | 'cardGAB';

interface Props {
  layoutKey: LayoutKeys;
  children: React.ReactNode;
  className?: string;
  isEndPos?: boolean;
}

export default function DraggableItem({ layoutKey, children, className, isEndPos }: Props) {
  const itemRef = useRef<HTMLDivElement>(null);
  const layout = useEventStore(state => state.layout[layoutKey]) as any;
  const updateLayout = useEventStore(state => state.updateLayout);
  const stageWidth = useEventStore(state => state.stageWidth);
  const stageHeight = useEventStore(state => state.stageHeight);
  
  const isEditMode = new URLSearchParams(window.location.search).get('edit') === 'true' || window.location.pathname.startsWith('/operator');

  const x = isEndPos ? (layout?.endX ?? 0) : (layout?.x ?? 0);
  const y = isEndPos ? (layout?.endY ?? 0) : (layout?.y ?? 0);
  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
  const maxX = Math.max(600, Math.round((stageWidth || 1920) / 2));
  const maxY = Math.max(360, Math.round((stageHeight || 1080) / 2));
  const safeScale = clamp(Number(layout?.scale ?? 1) || 1, 0.25, 3);
  const safeRotate = clamp(Number(layout?.rotate ?? 0) || 0, -180, 180);
  const safeOpacity = clamp(Number(layout?.opacity ?? 1) || 1, 0, 1);

  const getRenderedStageScale = () => {
    const stageFrame = itemRef.current?.closest('[data-stage-frame="true"]') as HTMLElement | null;
    const frameWidth = stageFrame?.getBoundingClientRect().width || stageWidth || 1920;
    return frameWidth > 0 ? frameWidth / Math.max(1, stageWidth || 1920) : 1;
  };

  return (
    <motion.div
      ref={itemRef}
      drag={isEditMode}
      dragMomentum={false}
      onDragEnd={(_e, info) => {
        if (!isEditMode) return;
        const renderedScale = getRenderedStageScale();
        const offsetX = info.offset.x / renderedScale;
        const offsetY = info.offset.y / renderedScale;
        if (isEndPos) {
          updateLayout(layoutKey, {
            endX: clamp(x + offsetX, -maxX, maxX),
            endY: clamp(y + offsetY, -maxY, maxY)
          });
        } else {
          updateLayout(layoutKey, {
            x: clamp(x + offsetX, -maxX, maxX),
            y: clamp(y + offsetY, -maxY, maxY)
          });
        }
      }}
      className={`absolute ${className || ''} ${isEditMode ? 'cursor-move hover:ring-2 hover:ring-gab-cyan' : ''}`}
      style={{
        left: '50%',
        top: '50%',
        x: `calc(-50% + ${clamp(x, -maxX, maxX)}px)`,
        y: `calc(-50% + ${clamp(y, -maxY, maxY)}px)`,
        scale: safeScale,
        rotate: safeRotate,
        opacity: safeOpacity,
        pointerEvents: isEditMode ? 'auto' : undefined
      }}
    >
       {children}
    </motion.div>
  );
}
