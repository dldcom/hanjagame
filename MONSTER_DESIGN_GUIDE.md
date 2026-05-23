# 몬스터 디자인 가이드 및 프롬프트 (Monster Design Guide)

이 문서는 한자 마법사 게임(Hanja Game) 프로젝트에서 앞으로 새로운 몬스터를 추가할 때, **일관된 그림체와 스타일**을 유지하기 위해 작성된 가이드입니다.

## 🎨 지정된 아트 스타일 (Art Style)
- **느낌**: 아기자기하고 귀여운 (Cute, Adorable, Chibi)
- **차원**: 2D 일러스트지만 평면적이지 않은 입체감 (Gentle 3D-like volume, Soft shading)
- **특징**: 크고 귀여운 눈(Big cute eyes), 친근한 인상(Friendly), 깔끔하고 디테일한 선과 색상
- **포맷**: 배경이 하얀색인 단독 캐릭터 스프라이트 형태 (White background, Standalone character)

---

## 🪄 고정 지시문 (Prompt Template)

앞으로 AI에게 새로운 몬스터 이미지를 생성해달라고 요청할 때, 혹은 저(AI) 스스로 몬스터를 생성할 때 반드시 아래의 고정 프롬프트를 베이스로 사용해야 합니다.

> **A very cute, adorable, chibi 2D game sprite of a [여기에 몬스터 이름/특징 입력], soft shading, gentle 3D-like volume, clean detailed illustration style but not flat, big cute eyes, friendly, white background, standalone character.**

### 💡 활용 예시
- **나무 괴물**을 만들고 싶을 때:
  `A very cute, adorable, chibi 2D game sprite of a tree monster, soft shading, gentle 3D-like volume, clean detailed illustration style but not flat, big cute eyes, friendly, white background, standalone character.`

- **불꽃 여우**를 만들고 싶을 때:
  `A very cute, adorable, chibi 2D game sprite of a fire fox monster, soft shading, gentle 3D-like volume...`

---

## 🛠 이미지 적용 파이프라인 (Pipeline)
1. 위 프롬프트를 사용하여 이미지를 생성합니다.
2. 파이썬 `rembg` 라이브러리를 사용하여 배경(흰색)을 깔끔하게 제거(투명화)합니다.
3. `/public` 폴더에 `[원하는이름].png` 로 저장한 후 `monsterData.js`에 등록하여 사용합니다.
