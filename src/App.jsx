import { useState, useRef, useCallback } from 'react';
import Camera from './components/Camera';
import LayoutSelector, { layouts } from './components/LayoutSelector';
import DelaySelector from './components/DelaySelector';
import PhotoThumbnails from './components/PhotoThumbnails';
import Countdown from './components/Countdown';
import StripPreview from './components/StripPreview';

// Filter options matching BeautyPlus style
const filters = [
  { id: 'normal', name: 'Normal', css: '' },
  { id: 'bw', name: 'BW', css: 'grayscale(100%)' },
  { id: 'vintage', name: 'Vintage', css: 'sepia(50%) contrast(90%) brightness(90%)' },
  { id: 'oldphoto', name: 'Old Photo', css: 'sepia(80%) contrast(80%) brightness(85%)' },
  { id: 'amber', name: 'Amber', css: 'sepia(40%) saturate(150%) hue-rotate(-10deg)' },
  { id: 'nocturne', name: 'Nocturne', css: 'saturate(110%) hue-rotate(20deg) brightness(90%) contrast(110%)' },
  { id: 'vivid', name: 'Vivid', css: 'saturate(180%) contrast(110%)' },
  { id: 'cool', name: 'Cool', css: 'saturate(110%) hue-rotate(20deg) brightness(105%)' },
];

function App() {
  const cameraRef = useRef(null);
  const fileInputRef = useRef(null);

  // Layout & Settings
  const [selectedLayout, setSelectedLayout] = useState('4v');
  const [countdownTime, setCountdownTime] = useState(3);
  const [selectedFilter, setSelectedFilter] = useState('normal');

  // Camera state
  const [facingMode, setFacingMode] = useState('user');
  const [isMirrored, setIsMirrored] = useState(true);
  const [isCameraReady, setIsCameraReady] = useState(false);

  // Capture state
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);

  // Preview state
  const [showStripPreview, setShowStripPreview] = useState(false);

  // Get current layout config
  const currentLayout = layouts.find(l => l.id === selectedLayout) || layouts[2];
  const currentFilter = filters.find(f => f.id === selectedFilter) || filters[0];

  // Start capture sequence
  const handleStartCapture = useCallback(() => {
    if (!isCameraReady || isCountingDown) return;

    setIsCapturing(true);
    setPhotos([]);
    setActivePhotoIndex(0);

    if (countdownTime === 0) {
      performCapture(0);
    } else {
      setIsCountingDown(true);
    }
  }, [isCameraReady, isCountingDown, countdownTime]);

  // Capture single photo
  const performCapture = useCallback((index) => {
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 300);

    if (cameraRef.current) {
      const photo = cameraRef.current.capturePhoto();
      if (photo) {
        setPhotos(prev => {
          const newPhotos = [...prev];
          newPhotos[index] = photo;
          return newPhotos;
        });

        // Check if we have more photos to take
        const nextIndex = index + 1;
        if (nextIndex < currentLayout.count) {
          setActivePhotoIndex(nextIndex);

          // Start countdown for next photo
          setTimeout(() => {
            if (countdownTime > 0) {
              setIsCountingDown(true);
            } else {
              performCapture(nextIndex);
            }
          }, 1000);
        } else {
          // All photos taken
          setIsCapturing(false);
        }
      }
    }
  }, [currentLayout.count, countdownTime]);

  // Countdown complete
  const handleCountdownComplete = useCallback(() => {
    setIsCountingDown(false);
    performCapture(activePhotoIndex);
  }, [performCapture, activePhotoIndex]);

  // Retake specific photo
  const handleRetakePhoto = useCallback((index) => {
    if (isCountingDown) return;

    setActivePhotoIndex(index);
    setIsCapturing(true);

    if (countdownTime === 0) {
      performCapture(index);
    } else {
      setIsCountingDown(true);
    }
  }, [countdownTime, isCountingDown, performCapture]);

  // Handle upload photo
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = useCallback((event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const loadedPhotos = [];
    let loadedCount = 0;
    const filesToLoad = Math.min(files.length, currentLayout.count);

    for (let i = 0; i < filesToLoad; i++) {
      const file = files[i];
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');

        // Calculate aspect ratio crop
        const srcRatio = img.width / img.height;
        const dstRatio = 640 / 480;
        let srcX = 0, srcY = 0, srcW = img.width, srcH = img.height;

        if (srcRatio > dstRatio) {
          srcW = img.height * dstRatio;
          srcX = (img.width - srcW) / 2;
        } else {
          srcH = img.width / dstRatio;
          srcY = (img.height - srcH) / 2;
        }

        ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, 640, 480);
        loadedPhotos[i] = canvas;
        loadedCount++;

        if (loadedCount === filesToLoad) {
          setPhotos(loadedPhotos);
          setIsCapturing(false);
        }
      };
      img.src = URL.createObjectURL(file);
    }

    event.target.value = '';
  }, [currentLayout.count]);

  // Next button - show preview
  const handleNext = useCallback(() => {
    if (photos.length === currentLayout.count) {
      setShowStripPreview(true);
    }
  }, [photos.length, currentLayout.count]);

  // Retake all
  const handleRetakeAll = useCallback(() => {
    setPhotos([]);
    setActivePhotoIndex(0);
    setIsCapturing(false);
    setShowStripPreview(false);
  }, []);

  // Close preview
  const handleClosePreview = useCallback(() => {
    setShowStripPreview(false);
  }, []);

  // Change layout
  const handleLayoutChange = useCallback((layoutId) => {
    setSelectedLayout(layoutId);
    setPhotos([]);
    setActivePhotoIndex(0);
    setIsCapturing(false);
  }, []);

  const allPhotosTaken = photos.length === currentLayout.count && photos.every(p => p);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">Photo Booth</h1>
        <p className="app-subtitle">Capture your best moments ✨</p>
      </header>

      {/* Top Controls Bar */}
      <div className="top-controls" style={{ padding: '0 12px' }}>
        <div className="top-controls-left">
          <LayoutSelector
            selectedLayout={selectedLayout}
            onSelectLayout={handleLayoutChange}
          />
          <DelaySelector
            selectedDelay={countdownTime}
            onSelectDelay={setCountdownTime}
          />
        </div>
        <button className="upload-btn" onClick={handleUploadClick}>
          <span>🖼️</span>
          Upload Photo
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
      </div>

      {/* Main Layout */}
      <main className="app-main">
        {/* Camera Section */}
        <section className="camera-section">
          <div className="camera-area">
            <Camera
              ref={cameraRef}
              selectedFilter={currentFilter.css}
              facingMode={facingMode}
              isMirrored={isMirrored}
              onStreamReady={setIsCameraReady}
            />

            {/* Photo Counter Badge */}
            {isCapturing && (
              <div className="strip-badge">
                📸 {photos.filter(p => p).length}/{currentLayout.count}
              </div>
            )}

            <Countdown
              count={countdownTime}
              isActive={isCountingDown}
              onComplete={handleCountdownComplete}
            />

            {showFlash && <div className="flash-effect" />}
          </div>

          {/* Filter Bar */}
          <div className="filter-bar">
            <span style={{
              color: 'var(--text-dim)',
              fontSize: '11px',
              paddingRight: '8px',
              flexShrink: 0
            }}>
              Choose a filter
            </span>
            {filters.map((filter) => (
              <button
                key={filter.id}
                className={`filter-pill ${selectedFilter === filter.id ? 'active' : ''}`}
                onClick={() => setSelectedFilter(filter.id)}
              >
                {filter.name}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{ padding: '0 4px' }}>
            {!allPhotosTaken ? (
              <button
                onClick={handleStartCapture}
                disabled={!isCameraReady || isCountingDown}
                className="start-capture-btn"
              >
                <span className="btn-icon">📷</span>
                Start Capture
              </button>
            ) : (
              <button onClick={handleNext} className="next-btn">
                Next
                <span>→</span>
              </button>
            )}
          </div>
        </section>

        {/* Photo Thumbnails Sidebar */}
        {(isCapturing || photos.length > 0) && (
          <aside style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            paddingBottom: '16px'
          }}>
            <PhotoThumbnails
              photos={photos}
              photoCount={currentLayout.count}
              activeIndex={activePhotoIndex}
              onSelectPhoto={handleRetakePhoto}
              filter={currentFilter.css}
            />
            {photos.length > 0 && (
              <button
                onClick={handleRetakeAll}
                style={{
                  width: '80px',
                  padding: '8px',
                  fontSize: '10px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                ↺ Retake All
              </button>
            )}
          </aside>
        )}
      </main>

      {/* Strip Preview Modal */}
      {showStripPreview && (
        <StripPreview
          photos={photos}
          layout={currentLayout}
          selectedFilter={currentFilter.css}
          onClose={handleClosePreview}
          onRetake={handleRetakeAll}
        />
      )}
    </div>
  );
}

export default App;
