import { motion } from 'framer-motion';
import type { ToolCategory, ToolDefinition } from '../../types/toolTypes';
import { ToolCard } from './ToolCard';
import { ToolGrid } from './ToolGrid';

interface CategorySectionProps {
  category: ToolCategory;
  tools: ToolDefinition[];
  /** Offset for stagger delay across categories */
  categoryIndex?: number;
}

export function CategorySection({ category, tools, categoryIndex = 0 }: CategorySectionProps) {
  if (tools.length === 0) return null;

  const Icon = category.icon;

  return (
    <motion.section
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.5,
        delay: categoryIndex * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      aria-labelledby={`category-${category.id}`}
    >
      {/* Category Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className={`p-2 rounded-lg ${category.bgColor}`}>
          <Icon size={20} className={category.color} />
        </div>
        <div>
          <h2
            id={`category-${category.id}`}
            className="text-lg font-bold text-text-primary"
          >
            {category.label}
          </h2>
          <p className="text-sm text-text-secondary">{category.description}</p>
        </div>
      </div>

      {/* Tool Cards Grid */}
      <ToolGrid>
        {tools.map((tool, index) => (
          <ToolCard key={tool.slug} tool={tool} index={index} />
        ))}
      </ToolGrid>
    </motion.section>
  );
}
