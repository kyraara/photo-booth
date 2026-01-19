const ModeSelector = ({ mode, onModeChange }) => {
    return (
        <div className="glass-card p-4">
            <div className="section-title">
                <span>📸</span> Mode
            </div>
            <div className="toggle-group">
                <button
                    onClick={() => onModeChange('single')}
                    className={`toggle-btn ${mode === 'single' ? 'active' : ''}`}
                >
                    📷 Single
                </button>
                <button
                    onClick={() => onModeChange('strip')}
                    className={`toggle-btn ${mode === 'strip' ? 'active' : ''}`}
                >
                    🎞️ Strip
                </button>
            </div>
        </div>
    );
};

export default ModeSelector;
