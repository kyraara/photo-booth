// Photo thumbnails sidebar for viewing and retaking individual photos
const PhotoThumbnails = ({ photos, photoCount, activeIndex, onSelectPhoto, filter }) => {
    // Create array of slots based on photoCount
    const slots = Array.from({ length: photoCount }, (_, i) => ({
        index: i,
        photo: photos[i] || null,
        isEmpty: !photos[i]
    }));

    return (
        <div className="photo-thumbnails">
            {slots.map((slot) => (
                <div
                    key={slot.index}
                    className={`thumbnail-item ${slot.isEmpty ? 'empty' : ''} ${slot.index === activeIndex ? 'active' : ''}`}
                    data-index={slot.index + 1}
                    onClick={() => onSelectPhoto(slot.index)}
                >
                    {!slot.isEmpty && (
                        <>
                            <img
                                src={slot.photo.toDataURL('image/jpeg', 0.7)}
                                alt={`Photo ${slot.index + 1}`}
                                style={{ filter: filter || 'none' }}
                            />
                            <div className="thumbnail-retake">
                                <span className="thumbnail-retake-icon">🔄</span>
                                <span className="thumbnail-retake-text">Click to retake</span>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default PhotoThumbnails;
