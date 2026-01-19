// Sticker options for photo booth
export const stickers = [
    { id: 'none', name: 'None', src: null },
    { id: 'stars', name: 'Stars', src: '/stickers/stars.png' },
    { id: 'hearts', name: 'Hearts', src: '/stickers/hearts.png' },
    { id: 'butterfly', name: 'Butterfly', src: '/stickers/butterfly.png' },
    { id: 'cloud', name: 'Cloud', src: '/stickers/cloud.png' },
    { id: 'rainbow', name: 'Rainbow', src: '/stickers/rainbow.png' },
    { id: 'bow', name: 'Bow', src: '/stickers/bow.png' },
    { id: 'flower', name: 'Flower', src: '/stickers/flower.png' },
    { id: 'cat', name: 'Cat', src: '/stickers/cat.png' },
    { id: 'sparkle', name: 'Sparkle', src: '/stickers/sparkle.png' },
];

const StickerSelector = ({ selectedSticker, onSelectSticker }) => {
    return (
        <div className="stickers-section">
            <div className="stickers-title">Stickers</div>
            <div className="stickers-grid">
                {stickers.map((sticker) => (
                    <button
                        key={sticker.id}
                        className={`sticker-btn ${sticker.id === 'none' ? 'none-sticker' : ''} ${selectedSticker === sticker.id ? 'active' : ''}`}
                        onClick={() => onSelectSticker(sticker.id)}
                        title={sticker.name}
                    >
                        {sticker.src ? (
                            <img src={sticker.src} alt={sticker.name} />
                        ) : (
                            '⊘'
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default StickerSelector;
