// Main.tsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import { Sphere, OrbitControls, Html, Text } from "@react-three/drei";
import styles from "./Generation.module.scss";
import { useNavigate } from "react-router-dom";

const Generation = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/number-generation"); // 원하는 라우트로 이동
  };

  // 1~45 사이의 랜덤 숫자 생성
  const getRandomNumber = () => Math.floor(Math.random() * 45) + 1;

  // 밝은 색상 배열
  const ballColors = [
    "#feca57", // 밝은 노란색
    "#ff6b6b", // 밝은 빨간색
    "#48dbfb", // 밝은 파란색
    "#1dd1a1", // 밝은 녹색
    "#ff9f43", // 밝은 주황색
  ];

  return (
    <div className={styles.centerArea}>
      <Canvas
        style={{ width: "100%", height: "400px", backgroundColor: "#f8f9fa" }}
      >
        {/* 카메라 컨트롤 */}
        <OrbitControls enableZoom={false} />

        {/* 조명 */}
        <ambientLight intensity={2.0} color="#ffffff" />
        <directionalLight
          position={[2, 5, 2]}
          intensity={2.5} // 더 밝게 설정
          color="#ffffff"
        />
        <directionalLight
          position={[-2, -5, -2]}
          intensity={1.5} // 추가 조명
          color="#ffffff"
        />

        {/* 중앙 구체 */}
        <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
          <meshPhongMaterial color="#ffcc00" shininess={50} />
          <Html center>
            <button className={styles.startButton} onClick={handleStartClick}>
              START
            </button>
          </Html>
        </Sphere>

        {/* 로또볼 */}
        {Array.from({ length: 20 }).map((_, index) => {
          const randomNumber = getRandomNumber();
          const randomColor =
            ballColors[Math.floor(Math.random() * ballColors.length)];
          const position = [
            (Math.random() - 0.5) * 8, // X축
            (Math.random() - 0.5) * 8, // Y축
            (Math.random() - 0.5) * 8, // Z축
          ];

          return (
            <Sphere key={index} args={[0.25, 32, 32]} position={position}>
              <meshPhongMaterial color={randomColor} shininess={70} />
              <Text
                position={[0, 0, 0.35]} // 텍스트를 구체의 표면에 배치
                fontSize={0.15}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
              >
                {randomNumber}
              </Text>
            </Sphere>
          );
        })}
      </Canvas>
    </div>
  );
};

export default Generation;
