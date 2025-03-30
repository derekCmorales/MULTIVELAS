import React, { useState, useEffect } from 'react';
import { Avatar, Box, CircularProgress } from '@mui/material';

interface ImageDisplayProps {
  src: string;
  alt: string;
  fallbackText: string;
  size?: number;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ src, alt, fallbackText, size = 50 }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      try {
        setLoading(true);
        setError(false);
        
        // Obtener el token de autenticación
        const token = localStorage.getItem('token');
        
        // Intentar cargar la imagen con fetch para verificar si existe
        const response = await fetch(src, {
          method: 'HEAD',
          mode: 'cors',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setImageSrc(src);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error al cargar la imagen:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (src) {
      loadImage();
    } else {
      setLoading(false);
      setError(true);
    }
  }, [src]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: size, height: size }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Avatar
      src={!error ? imageSrc || undefined : undefined}
      alt={alt}
      sx={{ 
        width: size, 
        height: size,
        bgcolor: error ? 'error.main' : 'primary.main'
      }}
    >
      {error ? fallbackText.charAt(0).toUpperCase() : undefined}
    </Avatar>
  );
};

export default ImageDisplay; 