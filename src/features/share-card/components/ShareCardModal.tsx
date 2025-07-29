import React, { useState, useRef } from 'react';
import { Modal, Button, Space, message, Spin } from 'antd';
import {
  DownloadOutlined,
  ShareAltOutlined,
  CopyOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { LotteryResultCard } from './LotteryResultCard';
import { GeneratedNumbersCard } from './GeneratedNumbersCard';
import { StatisticsCard } from './StatisticsCard';
import { generateShareCard, downloadImage, copyImageToClipboard, getShareUrl } from '../utils/cardGenerator';
import type { ShareCardData, ShareOptions } from '../types/share.types';

interface ShareCardModalProps {
  visible: boolean;
  onClose: () => void;
  cardData: ShareCardData;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  visible,
  onClose,
  cardData,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const renderCard = () => {
    switch (cardData.type) {
      case 'result':
        return <LotteryResultCard {...cardData} content={cardData.content} />;
      case 'numbers':
        return <GeneratedNumbersCard {...cardData} content={cardData.content} />;
      case 'stats':
        return <StatisticsCard {...cardData} content={cardData.content} />;
      default:
        return null;
    }
  };

  const handleGenerate = async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);
    try {
      const cardElement = cardRef.current.querySelector('.shareCard') as HTMLElement;
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const imageUrl = await generateShareCard(cardElement);
      setGeneratedImageUrl(imageUrl);
      message.success('이미지가 생성되었습니다!');
    } catch (error) {
      console.error('Failed to generate card:', error);
      message.error('이미지 생성에 실패했습니다');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImageUrl) {
      handleGenerate().then(() => {
        if (generatedImageUrl) {
          downloadImage(generatedImageUrl, `lottopass-${cardData.type}-${Date.now()}.png`);
          message.success('이미지가 다운로드되었습니다');
        }
      });
    } else {
      downloadImage(generatedImageUrl, `lottopass-${cardData.type}-${Date.now()}.png`);
      message.success('이미지가 다운로드되었습니다');
    }
  };

  const handleCopyImage = async () => {
    if (!generatedImageUrl) {
      await handleGenerate();
    }
    
    if (generatedImageUrl) {
      const success = await copyImageToClipboard(generatedImageUrl);
      if (success) {
        message.success('이미지가 클립보드에 복사되었습니다');
      } else {
        message.error('이미지 복사가 지원되지 않는 브라우저입니다');
      }
    }
  };

  const handleShare = (platform: ShareOptions['platform']) => {
    const shareText = `로또패스에서 확인한 ${cardData.title}`;
    const url = getShareUrl(platform, generatedImageUrl || '', shareText);
    
    if (url) {
      window.open(url, '_blank');
    } else if (platform === 'kakao') {
      message.info('카카오톡 공유는 준비 중입니다');
    } else if (platform === 'instagram') {
      message.info('인스타그램은 이미지를 다운로드 후 직접 공유해주세요');
    }
  };

  const handleClose = () => {
    if (generatedImageUrl) {
      URL.revokeObjectURL(generatedImageUrl);
    }
    setGeneratedImageUrl(null);
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={handleClose}
      width={700}
      footer={null}
      closeIcon={<CloseOutlined />}
      centered
    >
      <div style={{ padding: '20px 0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>결과 공유하기</h2>

        <div ref={cardRef} style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          {renderCard()}
        </div>

        <div style={{ textAlign: 'center' }}>
          {isGenerating ? (
            <Spin size="large" />
          ) : (
            <Space size="middle" wrap>
              <Button
                type="primary"
                size="large"
                icon={<DownloadOutlined />}
                onClick={handleDownload}
              >
                이미지 다운로드
              </Button>
              <Button
                size="large"
                icon={<CopyOutlined />}
                onClick={handleCopyImage}
              >
                이미지 복사
              </Button>
              <Button
                size="large"
                icon={<ShareAltOutlined />}
                onClick={() => handleShare('kakao')}
              >
                카카오톡
              </Button>
              <Button
                size="large"
                icon={<ShareAltOutlined />}
                onClick={() => handleShare('facebook')}
              >
                페이스북
              </Button>
            </Space>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 16, color: '#999' }}>
          <small>생성된 이미지를 저장하거나 SNS에 공유해보세요!</small>
        </div>
      </div>
    </Modal>
  );
};