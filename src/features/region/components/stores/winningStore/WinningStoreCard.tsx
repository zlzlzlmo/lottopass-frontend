import React, { useState } from "react";
import { Card, Button, Modal } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import { WinningRegion } from "lottopass-shared";
import styles from "./WinningStoreCard.module.scss";
import { openMap } from "../../../../../utils/map";
import { useAppSelector } from "@/redux/hooks";
import { getDistanceText } from "@/utils/distance";
import TagList from "../../../../../components/common/card/TagList";

const WinningStoreCard: React.FC<
  {
    distance?: number;
    drawNumbers?: number[];
    pathName?: string;
  } & Partial<WinningRegion>
> = ({
  method,
  storeName,
  address,
  coordinates,
  distance,
  drawNumbers,
  pathName,
}) => {
  const myLocation = useAppSelector((state) => state.location.myLocation);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleClick = () => {
    if (!coordinates) return;
    openMap(storeName ?? "", coordinates);
  };

  const handleMoreClick = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Card
        style={{ width: "100%" }}
        className={styles.storeCard}
        hoverable
        title={
          <span className={styles.storeName}>
            {storeName || "매장 이름 없음"}
          </span>
        }
        extra={
          pathName !== "/store-info" &&
          method && (
            <span className={styles.methodTag}>
              {method === "자동" ? "🌀 자동" : "✍ 수동"}
            </span>
          )
        }
      >
        {/* TagList 컴포넌트 사용 */}
        <TagList
          tags={drawNumbers || []}
          maxVisible={5}
          onMoreClick={handleMoreClick}
        />

        <p>
          <strong>주소:</strong>{" "}
          {address || (
            <span className={styles.placeholder}>주소 정보 없음</span>
          )}
        </p>

        <p>
          {myLocation !== null ? (
            <strong>{getDistanceText(distance)}</strong>
          ) : (
            <span className={styles.placeholder}>
              위치 정보를 활성화해주세요.
            </span>
          )}
        </p>

        <Button
          type="primary"
          icon={<EnvironmentOutlined />}
          onClick={handleClick}
          className={styles.navigateButton}
          block
          disabled={!coordinates}
        >
          길찾기
        </Button>
      </Card>

      {/* "더보기" 모달 */}
      <Modal
        title="회차 리스트"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        centered
      >
        <TagList tags={drawNumbers || []} />
      </Modal>
    </>
  );
};

export default WinningStoreCard;
