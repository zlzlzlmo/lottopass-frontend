import html2canvas from 'html2canvas';
import type { ShareCardData } from '../types/share.types';

export const generateShareCard = async (
  element: HTMLElement,
  filename: string = 'lottopass-share.png'
): Promise<string> => {
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 2, // Higher quality
      logging: false,
      useCORS: true,
      allowTaint: true,
    });

    // Convert to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to generate image'));
          return;
        }

        // Create URL for blob
        const url = URL.createObjectURL(blob);
        resolve(url);
      }, 'image/png');
    });
  } catch (error) {
    console.error('Error generating share card:', error);
    throw error;
  }
};

export const downloadImage = (imageUrl: string, filename: string = 'lottopass-share.png') => {
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the blob URL
  URL.revokeObjectURL(imageUrl);
};

export const copyImageToClipboard = async (imageUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    if (navigator.clipboard && 'write' in navigator.clipboard) {
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob,
        }),
      ]);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to copy image:', error);
    return false;
  }
};

export const getShareUrl = (platform: string, imageUrl: string, text: string = '') => {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(window.location.href);

  switch (platform) {
    case 'kakao':
      // Kakao requires SDK implementation
      return null;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
    case 'twitter':
      return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    case 'instagram':
      // Instagram doesn't support direct URL sharing
      return null;
    default:
      return null;
  }
};