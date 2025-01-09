interface KakaoLinkButton {
  title: string;
  link: {
    mobileWebUrl: string;
    webUrl: string;
  };
}

interface KakaoItemContent {
  profileText?: string;
  profileImageUrl?: string;
  titleImageUrl?: string;
  titleImageText?: string;
  titleImageCategory?: string;
  items?: Array<{
    item: string;
    itemOp: string;
  }>;
  sum?: string;
  sumOp?: string;
}

interface KakaoShareOptions {
  objectType: string; // 'feed', 'list', etc.
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  };
  itemContent?: KakaoItemContent;
  social?: {
    likeCount?: number;
    commentCount?: number;
    sharedCount?: number;
  };
  buttons?: KakaoLinkButton[];
}

interface KakaoShare {
  sendDefault(options: KakaoShareOptions): void;
}

interface Kakao {
  init(key: string): void;
  isInitialized(): boolean;
  Share: KakaoShare;
}

interface Window {
  Kakao: Kakao;
}
