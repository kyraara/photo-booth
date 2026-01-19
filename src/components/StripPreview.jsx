import { useEffect, useRef, useState } from 'react';
import FrameColorPicker, { frameColors } from './FrameColorPicker';
import StickerSelector, { stickers } from './StickerSelector';

const StripPreview = ({ photos, layout, selectedFilter, onClose, onRetake }) => {
    const canvasRef = useRef(null);
    const [finalImage, setFinalImage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(true);
    const [frameColor, setFrameColor] = useState('white');
    const [selectedSticker, setSelectedSticker] = useState('none');

    const currentFrameColor = frameColors.find(c => c.id === frameColor) || frameColors[1];
    const currentSticker = stickers.find(s => s.id === selectedSticker);

    useEffect(() => {
        if (!photos || photos.length === 0) return;

        const processStrip = async () => {
            setIsProcessing(true);

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            // Calculate dimensions based on layout
            const photoWidth = 300;
            const photoHeight = 225;
            const gap = 10;
            const padding = 20;
            const brandingHeight = 40;

            let stripWidth, stripHeight;

            if (layout.grid.cols === 1) {
                // Vertical strip
                stripWidth = photoWidth + (padding * 2);
                stripHeight = (photoHeight * layout.count) + (gap * (layout.count - 1)) + (padding * 2) + brandingHeight;
            } else {
                // Grid layout
                stripWidth = (photoWidth * layout.grid.cols) + (gap * (layout.grid.cols - 1)) + (padding * 2);
                stripHeight = (photoHeight * layout.grid.rows) + (gap * (layout.grid.rows - 1)) + (padding * 2) + brandingHeight;
            }

            canvas.width = stripWidth;
            canvas.height = stripHeight;

            // Draw background (frame color)
            if (currentFrameColor.type === 'gradient' || currentFrameColor.type === 'special') {
                // For gradients, create a gradient
                const gradient = ctx.createLinearGradient(0, 0, stripWidth, stripHeight);
                // Simple gradient approximation
                gradient.addColorStop(0, '#ff9a9e');
                gradient.addColorStop(1, '#fecfef');
                ctx.fillStyle = currentFrameColor.value.startsWith('#') ? currentFrameColor.value : '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            } else {
                ctx.fillStyle = currentFrameColor.value;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // Draw photos
            for (let i = 0; i < photos.length; i++) {
                let x, y;

                if (layout.grid.cols === 1) {
                    // Vertical strip
                    x = padding;
                    y = padding + (i * (photoHeight + gap));
                } else {
                    // Grid layout
                    const col = i % layout.grid.cols;
                    const row = Math.floor(i / layout.grid.cols);
                    x = padding + (col * (photoWidth + gap));
                    y = padding + (row * (photoHeight + gap));
                }

                // Add rounded corners clip
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, photoWidth, photoHeight, 8);
                ctx.clip();

                if (selectedFilter) {
                    ctx.filter = selectedFilter;
                }

                ctx.drawImage(photos[i], x, y, photoWidth, photoHeight);
                ctx.filter = 'none';
                ctx.restore();

                // Draw border
                ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(x, y, photoWidth, photoHeight, 8);
                ctx.stroke();
            }

            // Draw sticker if selected
            if (currentSticker && currentSticker.src) {
                try {
                    const stickerImg = new Image();
                    stickerImg.crossOrigin = 'anonymous';
                    await new Promise((resolve, reject) => {
                        stickerImg.onload = resolve;
                        stickerImg.onerror = reject;
                        stickerImg.src = currentSticker.src;
                    });

                    // Draw stickers at random positions around the strip
                    const stickerPositions = [
                        { x: 10, y: 10, size: 60 },
                        { x: stripWidth - 70, y: 10, size: 50 },
                        { x: stripWidth - 60, y: stripHeight - 100, size: 55 },
                        { x: 5, y: stripHeight - 110, size: 45 },
                        { x: stripWidth / 2 - 25, y: stripHeight - 80, size: 50 },
                    ];

                    for (const pos of stickerPositions.slice(0, 3)) {
                        ctx.drawImage(stickerImg, pos.x, pos.y, pos.size, pos.size);
                    }
                } catch (err) {
                    console.error('Sticker error:', err);
                }
            }

            // Branding
            ctx.fillStyle = currentFrameColor.value === '#ffffff' || currentFrameColor.value.includes('fff') ? '#666' : 'rgba(255,255,255,0.8)';
            ctx.font = 'bold 11px Inter, sans-serif';
            ctx.textAlign = 'center';
            const date = new Date().toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            });
            ctx.fillText(`Photo Booth`, canvas.width / 2, canvas.height - 22);
            ctx.font = '10px Inter, sans-serif';
            ctx.fillText(`${date}`, canvas.width / 2, canvas.height - 10);

            setFinalImage(canvas.toDataURL('image/png'));
            setIsProcessing(false);
        };

        processStrip();
    }, [photos, layout, selectedFilter, frameColor, selectedSticker, currentFrameColor, currentSticker]);

    const handleDownload = () => {
        if (!finalImage) return;

        const link = document.createElement('a');
        link.download = `photo-strip-${Date.now()}.png`;
        link.href = finalImage;
        link.click();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '800px' }}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="modal-title">
                        <span>🎞️</span> Edit Your Strip
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="edit-panel-strip">
                    {/* Strip Preview */}
                    <div className="edit-strip-preview" style={{
                        width: '200px',
                        background: currentFrameColor.value,
                        padding: '12px',
                        borderRadius: '12px'
                    }}>
                        <canvas ref={canvasRef} className="w-full h-auto rounded-lg" style={{ maxHeight: '50vh' }} />

                        {isProcessing && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-6 h-6 border-2 border-white/20 border-t-violet-400 rounded-full spinner" />
                                    <span className="text-white text-xs">Processing...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Edit Controls */}
                    <div className="edit-controls" style={{ flex: 1 }}>
                        {/* Layout Selector in Preview */}
                        <div style={{ marginBottom: '8px' }}>
                            <select
                                value={layout.count}
                                style={{
                                    padding: '8px 12px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    fontSize: '13px'
                                }}
                                disabled
                            >
                                <option>{layout.count} Photos</option>
                            </select>
                        </div>

                        {/* Frame Color Picker */}
                        <FrameColorPicker
                            selectedColor={frameColor}
                            onSelectColor={setFrameColor}
                        />

                        {/* Sticker Selector */}
                        <StickerSelector
                            selectedSticker={selectedSticker}
                            onSelectSticker={setSelectedSticker}
                        />

                        {/* Action Buttons */}
                        <div className="edit-actions" style={{ marginTop: '16px' }}>
                            <button onClick={handleDownload} disabled={isProcessing} className="download-btn">
                                <span>⬇️</span> Download
                            </button>
                            <button onClick={onRetake} className="retake-btn">
                                Retake
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StripPreview;
