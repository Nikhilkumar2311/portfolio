import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { ToolDefinition } from '../../types/toolTypes';

interface ToolCardProps {
  tool: ToolDefinition;
  index?: number;
}

export function ToolCard({ tool, index = 0 }: ToolCardProps) {
  const Icon = tool.icon;
  const isDisabled = tool.isDisabled;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      {isDisabled ? (
        <div
          className="group h-full p-5 rounded-2xl border border-border bg-surface/50 opacity-60 cursor-not-allowed"
          title={tool.disabledReason}
        >
          <CardContent icon={Icon} tool={tool} isDisabled />
        </div>
      ) : (
        <Link
          to={`/tools/${tool.slug}`}
          className="group block h-full p-5 rounded-2xl border border-border bg-surface/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
          id={`tool-${tool.slug}`}
        >
          <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <CardContent icon={Icon} tool={tool} />
          </motion.div>
        </Link>
      )}
    </motion.div>
  );
}

function CardContent({
  icon: Icon,
  tool,
  isDisabled = false,
}: {
  icon: typeof ArrowRight;
  tool: ToolDefinition;
  isDisabled?: boolean;
}) {
  return (
    <>
      <div className="flex items-start justify-between mb-3">
        <div className="p-2.5 rounded-lg bg-primary/10">
          <Icon size={20} className="text-primary" />
        </div>
        {!isDisabled && (
          <ArrowRight
            size={16}
            className="text-text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 mt-1"
          />
        )}
      </div>
      <h3 className="text-sm font-semibold text-text-primary mb-1 group-hover:text-primary transition-colors">
        {tool.title}
      </h3>
      <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
        {isDisabled ? tool.disabledReason : tool.description}
      </p>
    </>
  );
}
