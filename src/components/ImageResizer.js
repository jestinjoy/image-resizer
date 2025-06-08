import React, { useState } from 'react';

const ImageUploader = ({ onImageLoad }) => {
  return (
    <div className="mb-4">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => onImageLoad(evt.target.result);
            reader.readAsDataURL(file);
          }
        }}
        className="form-control"
      />
    </div>
  );
};

const drawWithBlurredBackground = (canvas, img, targetWidth, targetHeight) => {
  const ctx = canvas.getContext('2d');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  ctx.filter = 'blur(20px)';
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  ctx.filter = 'none';
  const aspectRatio = img.width / img.height;
  let drawWidth = targetWidth;
  let drawHeight = targetWidth / aspectRatio;
  if (drawHeight > targetHeight) {
    drawHeight = targetHeight;
    drawWidth = targetHeight * aspectRatio;
  }
  const offsetX = (targetWidth - drawWidth) / 2;
  const offsetY = (targetHeight - drawHeight) / 2;

  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
};

const InstagramConverter = ({ image }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  React.useEffect(() => {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      drawWithBlurredBackground(canvas, img, 1080, 1350);
      setPreviewUrl(canvas.toDataURL());
    };
    img.src = image;
  }, [image]);

  return (
    <div className="card mb-4 shadow">
      <div className="card-body text-center">
        {previewUrl && (
          <>
            <div style={{ width: '100%', maxWidth: '540px', margin: '0 auto' }}>
              <img src={previewUrl} alt="Instagram Preview" className="img-fluid rounded mb-3 border" style={{ aspectRatio: '4 / 5', width: '100%', objectFit: 'contain' }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const TVConverter = ({ image }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  React.useEffect(() => {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      drawWithBlurredBackground(canvas, img, 1920, 1080);
      setPreviewUrl(canvas.toDataURL());
    };
    img.src = image;
  }, [image]);

  return (
    <div className="card mb-4 shadow">
      <div className="card-body text-center">
        {previewUrl && (
          <>
            <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto' }}>
              <img src={previewUrl} alt="TV Preview" className="img-fluid rounded mb-3 border" style={{ aspectRatio: '16 / 9', width: '100%', objectFit: 'contain' }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ImageResizer = () => {
  const [image, setImage] = useState(null);
  const [mode, setMode] = useState('');
  const [downloadLabel, setDownloadLabel] = useState('');

  return (
    <div>
      <nav className="navbar navbar-dark bg-primary mb-4">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">🎨 Poster Formatter</span>
        </div>
      </nav>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <p className="text-center text-muted mb-4">
              Convert portrait posters to Instagram and TV-friendly formats
            </p>

            <ImageUploader onImageLoad={(img) => { setImage(img); setMode(''); }} />

            {image && (
              <div className="d-flex justify-content-center gap-3 mb-4">
                <button
                  onClick={() => {
                    setMode('instagram');
                    setDownloadLabel('Instagram');
                  }}
                  className="btn btn-primary"
                >
                  Instagram Portrait
                </button>
                <button
                  onClick={() => {
                    setMode('tv');
                    setDownloadLabel('TV');
                  }}
                  className="btn btn-success"
                >
                  TV Size
                </button>
              </div>
            )}

            {image && downloadLabel && (
              <div className="text-center mb-4">
                <a
                  href={downloadLabel === 'Instagram' ? document.querySelector('a[download="instagram-image.png"]')?.href : document.querySelector('a[download="tv-image.png"]')?.href}
                  download={`${downloadLabel.toLowerCase()}-image.png`}
                  className={`btn btn-${downloadLabel === 'Instagram' ? 'primary' : 'success'}`}
                >
                  Download {downloadLabel} Image
                </a>
              </div>
            )}

            {image && mode === 'instagram' && <InstagramConverter image={image} />}
            {image && mode === 'tv' && <TVConverter image={image} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageResizer;