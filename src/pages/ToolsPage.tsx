import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SectionTitle } from '../components/ui/SectionTitle';
import { SEOHead } from '../components/SEOHead';
import { SearchBar, CategorySection, PrivacyBanner, ToolCard, ToolGrid } from '../components/tools';
import { toolCategories, getToolsByCategory, searchTools } from '../data/toolsData';

export function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const isSearching = searchQuery.trim().length > 0;
  const searchResults = useMemo(() => searchTools(searchQuery), [searchQuery]);

  return (
    <>
      <SEOHead
        title="Developer Tools"
        description="A collection of browser-powered file conversion utilities. Convert images, PDFs, spreadsheets, and more — everything happens locally in your browser."
        canonicalUrl="/tools"
      />

      <section className="min-h-screen py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Developer Tools"
            subtitle="A collection of browser-powered file conversion utilities. Everything happens locally in your browser. No uploads. No tracking."
          />

          {/* Privacy Notice */}
          <motion.div
            className="mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PrivacyBanner />
          </motion.div>

          {/* Search */}
          <motion.div
            className="flex justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </motion.div>

          {/* Categories or Search Results */}
          {isSearching ? (
            <>
              <p className="text-sm text-text-secondary mb-6">
                {searchResults.length} tool{searchResults.length !== 1 ? 's' : ''} found for &ldquo;{searchQuery}&rdquo;
              </p>
              {searchResults.length > 0 ? (
                <ToolGrid>
                  {searchResults.map((tool, index) => (
                    <ToolCard key={tool.slug} tool={tool} index={index} />
                  ))}
                </ToolGrid>
              ) : (
                <motion.div className="text-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-text-secondary text-lg">No tools found matching your search.</p>
                  <button onClick={() => setSearchQuery('')} className="mt-4 text-primary hover:underline cursor-pointer">
                    Clear search
                  </button>
                </motion.div>
              )}
            </>
          ) : (
            toolCategories.map((category, index) => {
              const categoryTools = getToolsByCategory(category.id);
              return (
                <CategorySection
                  key={category.id}
                  category={category}
                  tools={categoryTools}
                  categoryIndex={index}
                />
              );
            })
          )}
        </div>
      </section>
    </>
  );
}
