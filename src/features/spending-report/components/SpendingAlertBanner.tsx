import React from 'react';
import { Alert, Space, Button } from 'antd';
import { ExclamationCircleOutlined, SettingOutlined } from '@ant-design/icons';
import type { SpendingAlert } from '../types/spending.types';

interface SpendingAlertBannerProps {
  alerts: SpendingAlert[];
  onSettingsClick?: () => void;
  onDismiss?: () => void;
}

export const SpendingAlertBanner: React.FC<SpendingAlertBannerProps> = ({
  alerts,
  onSettingsClick,
  onDismiss,
}) => {
  if (alerts.length === 0) return null;

  const mostSevereAlert = alerts.find((a) => a.isExceeded) || alerts[0];
  const alertType = mostSevereAlert.isExceeded ? 'error' : 'warning';

  const message = (
    <Space>
      <ExclamationCircleOutlined />
      <span>{mostSevereAlert.message}</span>
    </Space>
  );

  const description = alerts.length > 1 && (
    <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
      {alerts.slice(1).map((alert, index) => (
        <li key={index}>{alert.message}</li>
      ))}
    </ul>
  );

  const action = (
    <Space>
      {onSettingsClick && (
        <Button size="small" icon={<SettingOutlined />} onClick={onSettingsClick}>
          한도 설정
        </Button>
      )}
    </Space>
  );

  return (
    <Alert
      type={alertType}
      message={message}
      description={description}
      action={action}
      closable={!!onDismiss}
      onClose={onDismiss}
      style={{ marginBottom: 16 }}
      showIcon
    />
  );
};