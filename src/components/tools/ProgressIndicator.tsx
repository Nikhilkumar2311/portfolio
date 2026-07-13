import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import type { ProcessingState } from '../../types/toolTypes';

interface ProgressIndicatorProps {
  state: ProcessingState;
  progress?: number;
  error?: string | null;
  successMessage?: string;
}

export function ProgressIndicator({
  state,
  progress = 0,
  error,
  successMessage = 'Conversion complete!',
}: ProgressIndicatorProps) {
  if (state === 'idle' || state === 'loading') return null;

  return (
    <AnimatePresence mode="wait">
      {state === 'processing' && (
        <motion.div
          key="processing"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex flex-col items-center gap-3 p-6"
        >
          <Loader2 size={32} className="text-primary animate-spin" />
          <p className="text-sm font-medium text-text-primary">Processing...</p>
          {progress > 0 && progress < 100 && (
            <div className="w-full max-w-xs h-1.5 rounded-full bg-border overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}
        </motion.div>
      )}

      {state === 'success' && (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2 p-3 rounded-xl bg-green-400/10 border border-green-400/30"
        >
          <CheckCircle2 size={18} className="text-green-400 shrink-0" />
          <p className="text-sm font-medium text-green-400">{successMessage}</p>
        </motion.div>
      )}

      {state === 'error' && error && (
        <motion.div
          key="error"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2 p-3 rounded-xl bg-red-400/10 border border-red-400/30"
        >
          <AlertCircle size={18} className="text-red-400 shrink-0" />
          <p className="text-sm font-medium text-red-400">{error}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
