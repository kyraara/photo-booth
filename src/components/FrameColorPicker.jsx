// Frame color options matching BeautyPlus style
export const frameColors = [
    // Rainbow/Special
    { id: 'rainbow', name: 'Rainbow', value: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)', type: 'gradient' },
    { id: 'white', name: 'White', value: '#ffffff', type: 'solid' },
    { id: 'black', name: 'Black', value: '#1a1a1a', type: 'solid' },

    // Pinks
    { id: 'pink-light', name: 'Light Pink', value: '#ffb6c1', type: 'solid' },
    { id: 'pink', name: 'Pink', value: '#ff69b4', type: 'solid' },

    // Purples
    { id: 'lavender', name: 'Lavender', value: '#e6e6fa', type: 'solid' },
    { id: 'purple', name: 'Purple', value: '#9370db', type: 'solid' },

    // Blues
    { id: 'sky', name: 'Sky Blue', value: '#87ceeb', type: 'solid' },
    { id: 'blue', name: 'Blue', value: '#4169e1', type: 'solid' },

    // Greens
    { id: 'mint', name: 'Mint', value: '#98fb98', type: 'solid' },
    { id: 'green', name: 'Green', value: '#228b22', type: 'solid' },

    // Warm colors
    { id: 'peach', name: 'Peach', value: '#ffdab9', type: 'solid' },
    { id: 'coral', name: 'Coral', value: '#ff7f50', type: 'solid' },
    { id: 'yellow', name: 'Yellow', value: '#ffd700', type: 'solid' },

    // Neutrals
    { id: 'cream', name: 'Cream', value: '#fffdd0', type: 'solid' },
    { id: 'gray', name: 'Gray', value: '#808080', type: 'solid' },

    // Gradients
    { id: 'gradient-pink', name: 'Pink Gradient', value: 'linear-gradient(135deg, #ff9a9e, #fecfef)', type: 'gradient' },
    { id: 'gradient-purple', name: 'Purple Gradient', value: 'linear-gradient(135deg, #a18cd1, #fbc2eb)', type: 'gradient' },
    { id: 'gradient-blue', name: 'Blue Gradient', value: 'linear-gradient(135deg, #667eea, #764ba2)', type: 'gradient' },
    { id: 'glitter', name: 'Glitter', value: 'linear-gradient(45deg, #c0c0c0 25%, #fff 50%, #c0c0c0 75%)', type: 'special' },
    { id: 'holographic', name: 'Holographic', value: 'linear-gradient(135deg, #ff9a9e, #fad0c4, #a8edea, #fed6e3)', type: 'special' },
];

const FrameColorPicker = ({ selectedColor, onSelectColor }) => {
    const currentColor = frameColors.find(c => c.id === selectedColor) || frameColors[1]; // Default white

    return (
        <div className="frame-color-section">
            <div className="frame-color-title">Frame color</div>
            <div className="frame-color-grid">
                {frameColors.map((color) => (
                    <button
                        key={color.id}
                        className={`frame-color-btn ${selectedColor === color.id ? 'active' : ''} ${color.id === 'rainbow' ? 'rainbow' : ''} ${color.id === 'glitter' ? 'glitter' : ''}`}
                        style={{
                            background: color.value
                        }}
                        onClick={() => onSelectColor(color.id)}
                        title={color.name}
                    />
                ))}
            </div>
        </div>
    );
};

export default FrameColorPicker;
