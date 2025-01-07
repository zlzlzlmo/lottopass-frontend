import React from "react";
import { Tag } from "antd";
import styles from "./TagList.module.scss";

interface TagListProps {
  tags: number[];
  maxVisible?: number;
  onMoreClick?: () => void;
}

const TagList: React.FC<TagListProps> = ({ tags, maxVisible, onMoreClick }) => {
  const visibleTags = maxVisible ? tags.slice(0, maxVisible) : tags;

  return (
    <div className={styles.tagList}>
      {visibleTags.map((tag) => (
        <Tag color="blue" key={tag} className={styles.tag}>
          {tag}회
        </Tag>
      ))}
      {maxVisible && tags.length > maxVisible && onMoreClick && (
        <div className={styles.moreButton} onClick={onMoreClick}>
          <span className={styles.moreIcon}>•••</span>
          <span className={styles.moreText}>더보기</span>
        </div>
      )}
    </div>
  );
};

export default TagList;
