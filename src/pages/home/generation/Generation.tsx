import React from "react";
import { Canvas } from "@react-three/fiber";
import { Sphere, OrbitControls, Html, Text } from "@react-three/drei";
import * as THREE from "three";
import styles from "./Generation.module.scss";
import { useNavigate } from "react-router-dom";
import { shuffle } from "../../../utils/number";
import { ballColors } from "../../../constants/\bballs";

const centralSpherePosition = new THREE.Vector3(0, 0, 0); // 중심 구체 위치
const centralSphereMinDistance = 2; // 중심 구체와의 최소 거리

const Generation = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/number-generation"); // 원하는 라우트로 이동
  };

  const lottoBalls = Array.from({ length: 45 }, (_, i) => i + 1);
  const shuffledLottoBalls = shuffle(lottoBalls);

  const getBallColor = (ball: number): string => {
    const idx = Math.floor((ball - 1) / 10);
    return ballColors[idx];
  };

  const generateNonOverlappingPositions = (
    ballCount: number,
    minDistance: number
  ): THREE.Vector3[] => {
    const positions: THREE.Vector3[] = [];

    const getRandomPosition = (): THREE.Vector3 =>
      new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      );

    for (let i = 0; i < ballCount; i++) {
      let position = getRandomPosition();
      while (
        positions.some(
          (existing) => existing.distanceTo(position) < minDistance
        ) ||
        position.distanceTo(centralSpherePosition) < centralSphereMinDistance
      ) {
        position = getRandomPosition();
      }
      positions.push(position);
    }

    return positions;
  };

  // 로또볼의 위치 생성
  const positions = generateNonOverlappingPositions(
    shuffledLottoBalls.length,
    0.5 // 최소 거리
  );

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
          intensity={2.5}
          color="#ffffff"
        />
        <directionalLight
          position={[-2, -5, -2]}
          intensity={1.5}
          color="#ffffff"
        />

        {/* 중앙 구체 */}
        <Sphere args={[1, 32, 32]} position={centralSpherePosition}>
          <meshPhongMaterial color="#ffcc00" shininess={50} />
          <Html center>
            <button className={styles.startButton} onClick={handleStartClick}>
              START
            </button>
          </Html>
        </Sphere>

        {/* 로또볼 */}
        {shuffledLottoBalls.map((ball, index) => {
          const color = getBallColor(ball);
          const position = positions[index];

          return (
            <Sphere key={index} args={[0.25, 32, 32]} position={position}>
              <meshPhongMaterial color={color} shininess={70} />
              <Text
                position={[0, 0, 0.35]} // 텍스트를 구체의 표면에 배치
                fontSize={0.15}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
              >
                {ball}
              </Text>
            </Sphere>
          );
        })}
      </Canvas>
    </div>
  );
};

export default Generation;
