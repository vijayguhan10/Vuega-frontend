import React from 'react'


const FilterTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-border">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
            activeTab === tab.value
              ? 'bg-primary text-text shadow-sm'
              : 'text-text-muted hover:text-text'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default FilterTabs
