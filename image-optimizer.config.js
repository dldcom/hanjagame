import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

/**
 * 다른 프로젝트에서도 이 파일을 복사해서 사용할 수 있습니다.
 * vite.config.js 에서 import 하여 plugins 배열에 추가해주시면 됩니다.
 */
export function getImageOptimizerPlugin() {
  return ViteImageOptimizer({
    // 기본 설정 외에 압축률을 높이기 위한 옵션
    png: {
      quality: 70, // TinyPNG 수준의 높은 압축률 (기본값 100 대신 손실 허용)
    },
    jpeg: {
      quality: 70,
    },
    jpg: {
      quality: 70,
    },
    // 필요에 따라 추가 포맷 설정 가능
    webp: {
      quality: 75,
    },
  });
}
