# 신청 기록·메일 (Apps Script) 설치 — 약 10분

사이트의 사전 예약·기관 신청·문의가 **탭뷰 Gmail의 구글 시트**에 쌓이고, 신청자에게 확인 메일이 나가게 합니다.
모든 단계를 `tapview26@gmail.com`으로 로그인한 상태에서 하세요.

## 1. 시트 만들기
1. https://sheets.new 접속 → 새 스프레드시트 이름을 **탭뷰 신청 기록**으로 바꿉니다.
2. 메뉴 **확장 프로그램 ▸ Apps Script**를 엽니다.

## 2. 코드 붙여 넣기
1. 왼쪽 `Code.gs`의 내용을 모두 지우고, 이 폴더의 `Code.gs` 내용을 그대로 붙여 넣습니다.
2. 위쪽 프로젝트 이름을 **탭뷰 신청 접수**로 바꾸고 저장(디스크 아이콘)합니다.

## 3. 스크립트 속성 넣기
왼쪽 톱니바퀴 **프로젝트 설정 ▸ 스크립트 속성 ▸ 속성 추가**에서 아래 값을 넣습니다.
값은 `탭뷰_디자인/8_홈페이지_제작/AppsScript_설치값_비공개.txt` 파일에 있습니다. (리포에는 올리지 않습니다)

| 속성 | 값 |
|---|---|
| `SECRET` | 파일의 SECRET 값 |
| `OPERATOR_EMAIL` | `tapview26@gmail.com` |
| `SITE_URL` | `https://tapview.app` |
| `FROM_ALIAS` | (5단계를 마친 뒤에만) `tapview@tapview.app` |

## 4. 처음 실행과 배포
1. 편집기 위쪽 함수 목록에서 **setup**을 고르고 **실행** → 권한 확인 창에서 탭뷰 계정을 고르고 **허용**합니다.
   ('확인되지 않은 앱' 경고가 나오면 **고급 ▸ 탭뷰 신청 접수(안전하지 않음)로 이동**을 누르세요. 내가 만든 스크립트라 괜찮습니다.)
2. 시트로 돌아가면 개인·가족·기관·문의·일본알림·초대현황·발송대기·소식·발송기록 탭이 생깁니다.
3. 편집기 오른쪽 위 **배포 ▸ 새 배포 ▸ 유형: 웹 앱**
   - 실행 계정: **나**
   - 액세스 권한이 있는 사용자: **모든 사용자**
4. **배포**를 누르고 나오는 **웹 앱 URL**(`https://script.google.com/macros/s/…/exec`)을 복사해 Claude에게 알려 주세요.
   → Vercel의 `APPS_SCRIPT_URL`에 넣고 실제 신청으로 끝까지 시험합니다.

> 코드를 고친 뒤에는 **배포 ▸ 배포 관리 ▸ 연필 ▸ 버전: 새 버전 ▸ 배포**로 같은 URL을 유지하세요.

## 5. (선택) tapview@tapview.app 이름으로 보내기
1. Namecheap ▸ Domain List ▸ tapview.app ▸ **Manage ▸ Redirect Email** ▸ Alias `tapview` → Forward to `tapview26@gmail.com`
2. Google 계정 ▸ 보안 ▸ **2단계 인증** 켜기 → **앱 비밀번호** 만들기
3. Gmail ▸ 설정 ▸ 계정 및 가져오기 ▸ **다른 주소에서 메일 보내기 ▸ 다른 이메일 주소 추가**
   - 이름 `탭뷰 TapView`, 주소 `tapview@tapview.app`, 별칭으로 처리 체크
   - SMTP 서버 `smtp.gmail.com`, 포트 `587`, 사용자 `tapview26@gmail.com`, 비밀번호 = 앱 비밀번호, TLS
   - tapview@tapview.app으로 온 확인 메일(Gmail로 전달됨)의 링크를 누르면 끝
4. 스크립트 속성에 `FROM_ALIAS = tapview@tapview.app` 추가
5. Namecheap ▸ Advanced DNS의 SPF(TXT) 값을 `v=spf1 include:spf.efwd.registrar-servers.com include:_spf.google.com ~all`로 바꿉니다.

## 운영
- **새 신청 알림**: OPERATOR_EMAIL로 바로 옵니다.
- **초대현황** 탭: 누구의 링크로 몇 명이 첫 눈도장을 찍었는지 자동으로 셉니다 (3명 이상 → 체험단 우선 선발).
- **발송 한도**: 무료 Gmail은 하루 약 100통. 넘으면 `발송대기`에 쌓였다가 한 시간마다 이어서 보냅니다.
- **개발 소식 보내기**: `소식` 탭 A2(제목)·B2(본문)를 고친 뒤 시트 메뉴 **탭뷰 ▸ 개발 소식 보내기**. 소식 수신에 동의한 분에게만, 이미 받은 분은 빼고 보냅니다.
