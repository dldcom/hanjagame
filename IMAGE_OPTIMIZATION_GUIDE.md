# Vite 이미지 최적화 가이드 (다른 프로젝트 적용 방법)

이 프로젝트에 적용된 `vite-plugin-image-optimizer` 셋팅을 다른 프로젝트에서도 재사용하여 빌드 시 이미지 용량을 대폭(약 70% 이상) 압축하는 방법입니다.

## 🚀 적용 방법 (3단계)

### 1. 필수 패키지 설치
터미널을 열고 적용하고자 하는 프로젝트의 폴더에서 아래 명령어를 실행하여 필수 패키지들을 설치합니다.

```bash
npm install -D vite-plugin-image-optimizer sharp svgo
```

### 2. 설정 파일 복사
현재 프로젝트(`hanjagame`) 최상단에 있는 아래 파일을 복사해서 새로운 프로젝트의 최상단 경로에 붙여넣습니다.
- `image-optimizer.config.js`

> 이 파일에는 TinyPNG와 유사한 수준의 높은 압축률(손실 압축 허용, quality: 70) 설정이 미리 세팅되어 있습니다.

### 3. `vite.config.js` 에 플러그인 등록
적용할 프로젝트의 `vite.config.js` 파일을 열고, 방금 복사한 설정 파일을 불러와 `plugins` 배열에 추가합니다.

**적용 예시:**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 1. 복사해온 설정 함수 불러오기
import { getImageOptimizerPlugin } from './image-optimizer.config.js'

export default defineConfig({
  plugins: [
    react(), 
    // 2. plugins 배열 안에 함수 실행 형태로 추가하기
    getImageOptimizerPlugin()
  ],
})
```

## ✅ 확인하기
설정이 완료되면 터미널에서 `npm run build` 명령어를 실행해보세요!
터미널 결과창에 `[vite-plugin-image-optimizer]` 관련 로그가 출력되며 각 이미지들의 용량이 대폭 줄어든 것(약 50%~80%)을 확인할 수 있습니다.
