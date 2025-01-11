import COLORS from "@/constants/colors";

const PlaceholderContent = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <img
        src="/assets/search.png"
        alt="로또 판매점 찾기"
        style={{
          width: "200px",
          marginBottom: "10px",
        }}
      />
      <p
        style={{
          color: COLORS.NEUTRAL_DARK,
          fontSize: "16px",
          marginBottom: "10px",
        }}
      >
        찾고자 하는 지역을 선택하고 <br /> 검색 버튼을 눌러주세요.
      </p>
      <p
        style={{
          color: COLORS.NAVY_BLUE,
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        🌟 행운 복권을 안겨줄 매장을 찾아보세요!
      </p>
    </div>
  );
};

export default PlaceholderContent;
