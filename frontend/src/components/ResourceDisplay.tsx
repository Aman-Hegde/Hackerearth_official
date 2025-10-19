import { motion } from 'framer-motion';
import { ExternalLink, Play, Book, Video, FileText, Zap, Code, Laptop } from 'lucide-react';

interface Resource {
  title: string;
  link: string;
  type: string;
  emoji?: string;
}

interface ResourceSection {
  title: string;
  description: string;
  resources: Resource[];
  sectionType: 'core-tutorials' | 'video-courses' | 'docs' | 'es6-features' | 'practice' | 'reading';
  icon: string;
}

interface ResourceDisplayProps {
  resourceSections: ResourceSection[];
}

// Style configuration for different section types
const getSectionStyleConfig = (sectionType: ResourceSection['sectionType']) => {
  const styles = {
    'core-tutorials': {
      icon: <Book size={20} />,
      iconClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      textClass: 'text-blue-600 dark:text-blue-400',
      borderClass: 'border-blue-200/50 dark:border-blue-800/30',
      bgClass: 'bg-blue-50/50 dark:bg-blue-900/5 hover:bg-blue-100/70 dark:hover:bg-blue-900/15'
    },
    'video-courses': {
      icon: <Video size={20} />,
      iconClass: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      textClass: 'text-purple-600 dark:text-purple-400',
      borderClass: 'border-purple-200/50 dark:border-purple-800/30',
      bgClass: 'bg-purple-50/50 dark:bg-purple-900/5 hover:bg-purple-100/70 dark:hover:bg-purple-900/15'
    },
    'docs': {
      icon: <FileText size={20} />,
      iconClass: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
      textClass: 'text-emerald-600 dark:text-emerald-400',
      borderClass: 'border-emerald-200/50 dark:border-emerald-800/30',
      bgClass: 'bg-emerald-50/50 dark:bg-emerald-900/5 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/15'
    },
    'es6-features': {
      icon: <Zap size={20} />,
      iconClass: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
      textClass: 'text-amber-600 dark:text-amber-400',
      borderClass: 'border-amber-200/50 dark:border-amber-800/30',
      bgClass: 'bg-amber-50/50 dark:bg-amber-900/5 hover:bg-amber-100/70 dark:hover:bg-amber-900/15'
    },
    'practice': {
      icon: <Laptop size={20} />,
      iconClass: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      textClass: 'text-green-600 dark:text-green-400',
      borderClass: 'border-green-200/50 dark:border-green-800/30',
      bgClass: 'bg-green-50/50 dark:bg-green-900/5 hover:bg-green-100/70 dark:hover:bg-green-900/15'
    },
    'reading': {
      icon: <Book size={20} />,
      iconClass: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
      textClass: 'text-indigo-600 dark:text-indigo-400',
      borderClass: 'border-indigo-200/50 dark:border-indigo-800/30',
      bgClass: 'bg-indigo-50/50 dark:bg-indigo-900/5 hover:bg-indigo-100/70 dark:hover:bg-indigo-900/15'
    }
  };
  
  return styles[sectionType] || styles['core-tutorials'];
};

// Resource Item Component
const ResourceItem = ({ resource, index, sectionType }: { resource: Resource; index: number; sectionType: ResourceSection['sectionType'] }) => {
  const style = getSectionStyleConfig(sectionType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`group relative p-5 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${style.bgClass} ${style.borderClass}`}
    >
      {/* Subtle background accent */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/20 to-transparent dark:from-black/10 rounded-xl" />
      
      <div className="relative z-10">
        {/* Header with icon and title */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`p-2 rounded-lg flex-shrink-0 ${style.iconClass}`}>
              <span className="text-sm">{resource.emoji}</span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-base leading-tight">
                {resource.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {resource.type}
              </p>
            </div>
          </div>
          
          {/* External link indicator */}
          <motion.div
            animate={{ rotate: 0 }}
            whileHover={{ rotate: 45 }}
            transition={{ duration: 0.2 }}
            className={`p-1.5 rounded-full flex-shrink-0 ml-3 ${style.textClass} opacity-60 group-hover:opacity-100`}
          >
            <ExternalLink size={14} />
          </motion.div>
        </div>
        
        {/* Visit link with animation */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200/50 dark:border-slate-700/30">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-500">
            {resource.type.split('•')[0].trim()}
          </span>
          
          <motion.a
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`group/visit inline-flex items-center gap-1.5 text-sm font-medium ${style.textClass}`}
            whileHover={{ x: 2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span>Visit</span>
            <motion.div
              initial={{ x: 0 }}
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2 }}
            >
              <Play size={12} />
            </motion.div>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

// Section Header Component
const SectionHeader = ({ title, description, sectionType }: { title: string; description: string; sectionType: ResourceSection['sectionType'] }) => {
  const style = getSectionStyleConfig(sectionType);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-xl ${style.iconClass}`}>
          {style.icon}
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
          {title}
        </h2>
      </div>
      <p className="text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

// Main Resource Display Component
export const ResourceDisplay = ({ resourceSections }: ResourceDisplayProps) => {
  return (
    <div className="space-y-16">
      {resourceSections.map((section, sectionIndex) => (
        <section key={sectionIndex}>
          <SectionHeader
            title={section.title}
            description={section.description}
            sectionType={section.sectionType}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.resources.map((resource, resourceIndex) => (
              <ResourceItem
                key={resourceIndex}
                resource={resource}
                index={resourceIndex}
                sectionType={section.sectionType}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default ResourceDisplay;