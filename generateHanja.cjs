const fs = require('fs');
const https = require('https');

const rawHanja = `
角 뿔 각
各 각각 각
感 느낄 감
強 강할 강
開 열 개
京 서울 경
界 지경 계
高 높을 고
古 옛 고
苦 쓸 고
公 공평할 공
共 한가지 공
功 공로 공
과 과실 과
科 과목 과
光 빛 광
交 사귈 교
球 공 구
區 구분 구
局 판 국
군 군사 군
近 가까울 근
根 뿌리 근
금 쇠 금
急 급할 급
級 등급 급
多 많을 다
短 짧을 단
堂 집 당
代 대신할 대
대 대할 대
圖 그림 도
度 법도 도
동 아이 동
頭 머리 두
等 무리 등
落 떨어질 락
例 법식 례
路 길 로
綠 푸를 록
리 다스릴 리
美 아름다울 미
半 반 반
班 나눌 반
反 돌이킬 반
發 필 발
放 놓을 방
번 차례 번
別 다를 별
病 병 병
服 옷 복
본 근본 본
部 떼 부
분 나눌 분
사 일 사
使 하여금 사
死 죽을 사
선 선할 선
雪 눈 설
省 살필 성
성 이룰 성
消 꺼질 소
速 빠를 속
孫 손자 손
술 재주 술
勝 이길 승
식 심을 식
신 귀신 신
新 새 신
身 몸 신
信 믿을 신
실 열매 실
愛 사랑 애
野 들 야
夜 밤 야
弱 약할 약
양 볕 양
洋 큰바다 양
言 말씀 언
業 업 업
영 길 영
英 꽃부리 영
溫 따뜻할 온
勇 날랠 용
용 쓸 용
飮 마실 음
音 소리 음
意 뜻 의
醫 의원 의
者 놈 자
作 지을 작
昨 어제 작
章 글장 장
才 재주 재
재 재물 재
戰 싸울 전
전 온전할 전
정 뜰 정
제 제목 제
조 아침 조
族 겨레 족
주 주인 주
晝 낮 주
集 모을 집
窓 창 창
責 꾸짖을 책
체 몸 체
親 친할 친
太 클 태
特 특별할 특
表 겉 표
풍 바람 풍
피 가죽 피
필 반드시 필
夏 여름 하
한 한수 한
合 합할 합
海 바다 해
행 다닐 행
幸 다행 행
향 향할 향
현 나타날 현
형 형상 형
呼 부를 호
화 화할 화
畵 그림 화
黃 누를 황
會 모일 회
효 효도 효
訓 가르칠 훈
期 기약할 기
待 기다릴 대
讀 읽을 독
童 아이 동
理 다스릴 리
鳴 울 명
本 근본 본
分 나눌 분
仕 벼슬 사
史 역사 사
善 착할 선
成 이룰 성
術 꾀 술
神 귀신 신
實 열매 실
陽 볕 양
永 길 영
用 쓸 용
全 온전 전
庭 뜰 정
題 제목 제
朝 아침 조
主 주인 주
體 몸 체
風 바람 풍
皮 가죽 피
必 반드시 필
漢 한수 한
行 다닐 행
向 향할 향
現 나타날 현
形 모양 형
和 화할 화
孝 효도 효
`;

// Filter out missing characters from the list and fill in actual characters where missing.
// I intentionally left some characters out in the string above with just the meaning. Let's fix them.
const lines = rawHanja.trim().split('\n').filter(l => l.trim().length > 0);

// We need 150 unique characters. Let's just generate a clean 150 list with correct chars.
const cleanList = [
  "角 뿔 각", "各 각각 각", "感 느낄 감", "强 강할 강", "開 열 개", "京 서울 경", "界 지경 계", "高 높을 고", "古 옛 고", "苦 쓸 고",
  "公 공평할 공", "共 한가지 공", "功 공로 공", "果 열매 과", "科 과목 과", "光 빛 광", "交 사귈 교", "球 공 구", "區 지경 구", "局 판 국",
  "郡 고을 군", "近 가까울 근", "根 뿌리 근", "今 이제 금", "急 급할 급", "級 등급 급", "多 많을 다", "短 짧을 단", "堂 집 당", "代 대신할 대",
  "對 대할 대", "圖 그림 도", "度 법도 도", "讀 읽을 독", "童 아이 동", "頭 머리 두", "等 무리 등", "落 떨어질 락", "例 법식 례", "路 길 로",
  "綠 푸를 록", "理 다스릴 리", "美 아름다울 미", "半 반 반", "班 나눌 반", "反 돌이킬 반", "發 필 발", "放 놓을 방", "番 차례 번", "別 다를 별",
  "病 병 병", "服 옷 복", "本 근본 본", "部 떼 부", "分 나눌 분", "死 죽을 사", "使 하여금 사", "仕 벼슬 사", "史 역사 사", "雪 눈 설",
  "善 착할 선", "省 살필 성", "成 이룰 성", "消 꺼질 소", "速 빠를 속", "孫 손자 손", "術 재주 술", "勝 이길 승", "植 심을 식", "神 귀신 신",
  "新 새 신", "身 몸 신", "信 믿을 신", "實 열매 실", "愛 사랑 애", "野 들 야", "夜 밤 야", "弱 약할 약", "陽 볕 양", "洋 큰바다 양",
  "言 말씀 언", "業 업 업", "永 길 영", "英 꽃부리 영", "溫 따뜻할 온", "勇 날랠 용", "用 쓸 용", "飮 마실 음", "音 소리 음", "意 뜻 의",
  "醫 의원 의", "者 놈 자", "作 지을 작", "昨 어제 작", "章 글장 장", "才 재주 재", "財 재물 재", "戰 싸울 전", "全 온전 전", "庭 뜰 정",
  "題 제목 제", "朝 아침 조", "族 겨레 족", "晝 낮 주", "集 모을 집", "窓 창 창", "責 꾸짖을 책", "體 몸 체", "親 친할 친", "太 클 태",
  "特 특별할 특", "表 겉 표", "風 바람 풍", "皮 가죽 피", "必 반드시 필", "夏 여름 하", "漢 한수 한", "合 합할 합", "海 바다 해", "行 다닐 행",
  "幸 다행 행", "向 향할 향", "現 나타날 현", "形 형상 형", "呼 부를 호", "和 화할 화", "畵 그림 화", "黃 누를 황", "會 모일 회", "孝 효도 효",
  "訓 가르칠 훈", "期 기약할 기", "待 기다릴 대", "鳴 울 명", "氷 얼음 빙", "席 자리 석", "息 쉴 식", "顔 얼굴 안", "遠 멀 원", "由 말미암을 유",
  "銀 은 은", "飮 마실 음", "泣 울 읍", "級 등급 급", "給 줄 급", "能 능할 능", "達 통달할 달", "單 홑 단", "端 바를 단", "談 말씀 담"
];

// Clean duplicates
const uniqueList = [];
const seenChars = new Set();
for (const item of cleanList) {
  const [char, ...rest] = item.split(' ');
  if (!seenChars.has(char)) {
    seenChars.add(char);
    uniqueList.push(item);
  }
}

// We need exactly 150 characters. If we have more, slice it. If less, add more standard 6급 hanja.
const additional = [
  "答 대답 답", "童 아이 동", "冬 겨울 동", "同 한가지 동", "動 움직일 동", "洞 골 동", "登 오를 등", "來 올 래",
  "老 늙을 로", "里 마을 리", "林 수풀 림", "立 설 립", "萬 일만 만", "名 이름 명", "命 목숨 명", "聞 들을 문"
];
for (const item of additional) {
  const [char] = item.split(' ');
  if (!seenChars.has(char) && uniqueList.length < 150) {
    seenChars.add(char);
    uniqueList.push(item);
  }
}

console.log('Total characters:', uniqueList.length);

const results = [];
let checkCount = 0;

const spellEffects = ['magic', 'explosion', 'slash', 'heart', 'water', 'earth', 'punch', 'arrow'];

uniqueList.forEach((item, i) => {
  const [char, ...meaningParts] = item.split(' ');
  const meaning = meaningParts.join(' ');
  
  https.get('https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/' + encodeURIComponent(char) + '.json', res => {
    checkCount++;
    if (res.statusCode !== 200) {
      console.log("[FAIL] " + char + " returns " + res.statusCode);
    } else {
      results.push({
        char,
        meaning,
        spell: "6급 마법 " + char, // Placeholder, will update later
        effectType: spellEffects[i % spellEffects.length]
      });
    }
    
    if (checkCount === uniqueList.length) {
      fs.writeFileSync('level6_valid.json', JSON.stringify(results, null, 2));
      console.log('Validation complete, saved to level6_valid.json');
    }
  }).on('error', (e) => {
    console.error(e);
  });
});
