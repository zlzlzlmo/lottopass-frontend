import React, { useState, useEffect } from 'react';
import { Button, Card, Space, Typography, notification } from 'antd';
import { DownloadOutlined, CloseOutlined, ReloadOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '@/hooks/usePWA';
import styles from './PWAInstallPrompt.module.scss';

const { Text, Title } = Typography;

export const PWAInstallPrompt: React.FC = () => {
  const { isInstalled, canInstall, isUpdateAvailable, install, update } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // 설치 가능하고 아직 설치되지 않았으며 거부하지 않은 경우
    if (canInstall && !isInstalled && !isDismissed) {
      // 3초 후에 프롬프트 표시
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [canInstall, isInstalled, isDismissed]);

  const handleInstall = async () => {
    const success = await install();
    
    if (success) {
      notification.success({
        message: '앱 설치 완료',
        description: '로또패스가 성공적으로 설치되었습니다!',
      });
      setShowPrompt(false);
    } else {
      notification.error({
        message: '설치 실패',
        description: '앱 설치에 실패했습니다. 나중에 다시 시도해주세요.',
      });
    }
  };

  const handleUpdate = async () => {
    await update();
    notification.info({
      message: '업데이트 진행 중',
      description: '앱이 업데이트되고 있습니다. 잠시 후 새로고침됩니다.',
    });
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setIsDismissed(true);
    
    // 24시간 동안 다시 표시하지 않음
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  // 업데이트 알림
  if (isUpdateAvailable) {
    return (
      <div className={styles.updateBanner}>
        <Space>
          <ReloadOutlined spin />
          <Text>새로운 버전이 있습니다</Text>
          <Button size="small" type="primary" onClick={handleUpdate}>
            업데이트
          </Button>
        </Space>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {showPrompt && canInstall && !isInstalled && (
        <motion.div
          className={styles.installPrompt}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            className={styles.promptCard}
            actions={[
              <Button 
                key="install" 
                type="primary" 
                icon={<DownloadOutlined />}
                onClick={handleInstall}
                block
              >
                앱 설치하기
              </Button>,
              <Button 
                key="dismiss" 
                icon={<CloseOutlined />}
                onClick={handleDismiss}
              >
                나중에
              </Button>,
            ]}
          >
            <Space direction="vertical" size="small">
              <Title level={5}>로또패스를 앱으로 설치하세요!</Title>
              <Text type="secondary">
                홈 화면에 추가하여 더 빠르고 편리하게 사용할 수 있습니다.
              </Text>
              <ul className={styles.features}>
                <li>오프라인에서도 사용 가능</li>
                <li>빠른 실행 속도</li>
                <li>푸시 알림 지원</li>
              </ul>
            </Space>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// PWA 오프라인 인디케이터
export const PWAOfflineIndicator: React.FC = () => {
  const { isOffline } = usePWA();
  
  if (!isOffline) return null;
  
  return (
    <div className={styles.offlineIndicator}>
      <Text type="warning">오프라인 모드 - 일부 기능이 제한될 수 있습니다</Text>
    </div>
  );
};