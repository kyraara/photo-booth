import { useState, useRef, useEffect } from 'react';

// Layout configurations matching BeautyPlus Photo Booth
export const layouts = [
    {
        id: '2h',
        name: '2 Photos',
        count: 2,
        icon: '▭▭',
        grid: { cols: 1, rows: 2 },
        description: 'Vertical strip - 2 photos'
    },
    {
        id: '3v',
        name: '3 Photos',
        count: 3,
        icon: '▯▯▯',
        grid: { cols: 1, rows: 3 },
        description: 'Vertical strip - 3 photos'
    },
    {
        id: '4v',
        name: '4 Photos',
        count: 4,
        icon: '▯▯▯▯',
        grid: { cols: 1, rows: 4 },
        description: 'Vertical strip - 4 photos'
    },
    {
        id: '4g',
        name: '4 Photos',
        count: 4,
        icon: '▢▢\n▢▢',
        grid: { cols: 2, rows: 2 },
        description: 'Grid - 2x2'
    },
    {
        id: '6g',
        name: '6 Photos',
        count: 6,
        icon: '▢▢\n▢▢\n▢▢',
        grid: { cols: 2, rows: 3 },
        description: 'Grid - 2x3'
    },
    {
        id: '9g',
        name: '9 Photos',
        count: 9,
        icon: '▢▢▢\n▢▢▢\n▢▢▢',
        grid: { cols: 3, rows: 3 },
        description: 'Grid - 3x3'
    }
];

const LayoutSelector = ({ selectedLayout, onSelectLayout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Find current layout
    const currentLayout = layouts.find(l => l.id === selectedLayout) || layouts[2]; // Default 4v

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="layout-selector" ref={dropdownRef}>
            <button
                className="layout-dropdown-btn"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="layout-icon">{currentLayout.icon.split('\n')[0]}</span>
                <span className="layout-count">{currentLayout.count} Photos</span>
                <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
            </button>

            {isOpen && (
                <div className="layout-dropdown">
                    {layouts.map((layout) => (
                        <button
                            key={layout.id}
                            className={`layout-option ${selectedLayout === layout.id ? 'active' : ''}`}
                            onClick={() => {
                                onSelectLayout(layout.id);
                                setIsOpen(false);
                            }}
                        >
                            <div className="layout-option-icon">
                                <LayoutPreviewIcon layout={layout} />
                            </div>
                            <div className="layout-option-info">
                                <span className="layout-option-name">{layout.count} Photos</span>
                                <span className="layout-option-desc">{layout.description}</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// Visual preview icon for each layout
const LayoutPreviewIcon = ({ layout }) => {
    const { cols, rows } = layout.grid;

    return (
        <div
            className="layout-preview-grid"
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                gap: '2px',
                width: cols === 1 ? '12px' : '24px',
                height: rows <= 2 ? '20px' : rows <= 3 ? '28px' : '36px'
            }}
        >
            {Array.from({ length: layout.count }).map((_, i) => (
                <div
                    key={i}
                    className="layout-preview-cell"
                    style={{
                        background: 'currentColor',
                        borderRadius: '1px',
                        opacity: 0.7
                    }}
                />
            ))}
        </div>
    );
};

export { LayoutPreviewIcon };
export default LayoutSelector;
