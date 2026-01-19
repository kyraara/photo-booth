const filters = [
    { id: 'none', name: 'None', css: '' },
    { id: 'bw', name: 'B&W', css: 'grayscale(100%)' },
    { id: 'sepia', name: 'Sepia', css: 'sepia(100%)' },
    { id: 'vintage', name: 'Vintage', css: 'sepia(50%) contrast(90%) brightness(90%)' },
    { id: 'warm', name: 'Warm', css: 'saturate(150%) hue-rotate(-10deg)' },
    { id: 'cool', name: 'Cool', css: 'saturate(110%) hue-rotate(20deg) brightness(105%)' },
    { id: 'contrast', name: 'Contrast', css: 'contrast(140%) brightness(95%)' },
    { id: 'vivid', name: 'Vivid', css: 'saturate(180%) contrast(110%)' },
];

const FilterSelector = ({ selectedFilter, onSelectFilter }) => {
    return (
        <div className="glass-card p-4">
            <div className="section-title">
                <span>🎨</span> Filter
            </div>

            <div className="selection-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => onSelectFilter(filter.css)}
                        className={`selection-item flex flex-col items-center justify-center gap-1 p-2 ${selectedFilter === filter.css ? 'active' : ''}`}
                    >
                        <div
                            className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400"
                            style={{ filter: filter.css || 'none' }}
                        />
                        <span className="text-[9px] text-white/60">{filter.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export { filters };
export default FilterSelector;
