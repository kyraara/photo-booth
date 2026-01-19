import { useState } from 'react';

const frames = [
    { id: 'none', name: 'None', src: null },
    { id: 'classic', name: 'Classic', src: '/frames/frame-classic.svg' },
    { id: 'polaroid', name: 'Polaroid', src: '/frames/frame-polaroid.svg' },
    { id: 'vintage', name: 'Vintage', src: '/frames/frame-vintage.svg' },
    { id: 'hearts', name: 'Hearts', src: '/frames/frame-hearts.svg' },
    { id: 'stars', name: 'Stars', src: '/frames/frame-stars.svg' },
    { id: 'birthday', name: 'Birthday', src: '/frames/frame-birthday.svg' },
    { id: 'wedding', name: 'Wedding', src: '/frames/frame-wedding.svg' },
    { id: 'neon', name: 'Neon', src: '/frames/frame-neon.svg' },
    { id: 'floral', name: 'Floral', src: '/frames/frame-floral.svg' },
    { id: 'retro', name: 'Retro', src: '/frames/frame-retro.svg' },
    { id: 'minimal', name: 'Minimal', src: '/frames/frame-minimal.svg' },
];

const FrameSelector = ({ selectedFrame, onSelectFrame }) => {
    const [expanded, setExpanded] = useState(false);
    const visibleFrames = expanded ? frames : frames.slice(0, 6);

    return (
        <div className="glass-card p-4">
            <div className="section-title">
                <span>🖼️</span> Frame
            </div>

            <div className="selection-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {visibleFrames.map((frame) => (
                    <button
                        key={frame.id}
                        onClick={() => onSelectFrame(frame.src)}
                        className={`selection-item ${selectedFrame === frame.src ? 'active' : ''}`}
                    >
                        {frame.src ? (
                            <img
                                src={frame.src}
                                alt={frame.name}
                                className="w-full h-full object-contain p-1"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/30 text-xl">
                                ✕
                            </div>
                        )}
                        <span className="selection-label">{frame.name}</span>
                    </button>
                ))}
            </div>

            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full mt-3 py-2 text-xs text-white/40 hover:text-white/70 transition-colors flex items-center justify-center gap-1"
            >
                {expanded ? '△ Less' : `▽ More (${frames.length})`}
            </button>
        </div>
    );
};

export default FrameSelector;
