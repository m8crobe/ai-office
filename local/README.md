# 실제 작업 관찰 (local only)

## 가능한 연결 방식과 한계

현재 공개 앱은 정적 Vite 앱이며 Codex의 세션·도구 이벤트를 구독하는 SDK나 인증된 백엔드가 없습니다. 브라우저만으로 임의의 로컬 프로세스·파일을 안전하게 관찰할 수 없습니다. 이번 구현은 **명시적으로 CLI에서 전달한 이벤트**를 로컬 저널에 기록하는 최소 어댑터입니다. Codex 자동 실행·자동 세션 감지·외부 API·다른 저장소 접근은 없습니다. 사용자가 승인한 향후 Codex 어댑터는 같은 생명주기 계약을 사용할 수 있지만 현재 연결되어 있지 않습니다.

- `start → progress* → complete | fail` 이벤트, 직원별 단일 활성 업무, 종료 후 추가 이벤트 거부
- `source: local-observation`, `producer: explicit-cli`로 시뮬레이션 데이터와 완전 분리
- 서버는 이 저장소 경로를 코드 위치로 고정합니다. 클라이언트가 경로나 명령을 지정할 수 없습니다.
- 각 이벤트에 이 체크아웃의 HEAD 및 tracked 파일 변경 목록을 `git` 읽기 명령으로 연결합니다. 파일 내용·diff·환경 변수·명령 로그는 수집하지 않습니다.
- 현재 Git 스냅샷과 이벤트 당시 스냅샷을 구분합니다. 로컬 HEAD는 GitHub 푸시 증거가 아닙니다. 변경 목록은 누가 변경했는지 증명하지 않습니다.
- `observe:check`만 고정된 `npm test`를 **사용자가 직접 실행**하고 종료 코드를 기록합니다. 임의 명령 실행 API는 없습니다. 종료 코드 0은 테스트 개수나 개별 assertion 성공의 독립 증명이 아닙니다.
- CLI 이벤트는 사용자가 입력한 관찰 기록이며 Codex 실행·작성의 암호학적 증명은 아닙니다. 실행 시간이란 이벤트 시작~종료 시간입니다.
- 종료 이벤트가 누락되면 활성 상태가 남습니다. 서버는 실제 프로세스 생존 여부를 추정하지 않으며 화면에 이 한계를 표시합니다. 실패를 수동 기록해 종료할 수 있습니다.
- 실제 모드는 진행률·캐릭터 이동을 임의 생성하지 않습니다. 현재 별도 읽기 전용 화면의 활성/대기 표시만 이벤트를 따르며 Canvas 연결은 후속 작업입니다.

## 실행

프로젝트 루트에서 Node.js 22+:

```sh
npm run observe
```

**개인 PC에서 실행 후** Chrome에서 터미널에 표시된 loopback 주소를 엽니다. `.local-observer/access-token`을 로컬에서 확인하고 로그인 폼에 입력합니다. 토큰을 채팅·URL·Git에 넣지 마세요. PowerShell에서는 `Get-Content .local-observer/access-token`, macOS/Linux에서는 `cat .local-observer/access-token`으로 직접 확인할 수 있습니다. 토큰을 바꾸려면 서버 종료 후 해당 파일을 삭제하고 다시 시작합니다. 서버 재시작 시 세션이 만료됩니다.

클라우드/원격 프리뷰에 관찰 서버 포트를 공개하지 마세요. 서버는 `127.0.0.1:4318`에만 바인딩하고 Host와 Origin을 엄격히 검사합니다. 공개 Pages 화면에는 실제 모드 전환 링크도 없습니다.

다른 터미널에서 실제로 수행하는 작업에 맞춰 기록합니다. 다음은 **사용 예시이며 실행 사실이 없는 이벤트를 실제 Codex 작업이라고 입력하지 마세요.**

```sh
npm run observe:event -- start dev inspect-office "ai-office 코드 읽기 검토 시작"
npm run observe:event -- progress dev inspect-office "현재 구조 확인 완료"
npm run observe:event -- complete dev inspect-office "검토 결과 정리 완료"
# 실패 시 complete 대신:
# npm run observe:event -- fail dev inspect-office "검토 중단 사유"
```

직원 ID: `lead`, `dev`, `review`, `research`. task ID는 영문·숫자·밑줄·하이픈, 최대 80자입니다. summary는 최대 500자로 제한됩니다. 비밀정보를 summary에 입력하지 마세요.

```sh
npm run observe:check
```

이 명령은 검토 직원에게 업무를 할당하고 실제 로컬 `npm test`를 실행한 뒤 종료 코드와 Git 증거를 기록합니다. 이미 검토 직원의 활성 작업이 있다면 실행 전에 거부합니다. 애플리케이션 코드나 Git 상태는 수정하지 않지만 npm test 자체는 저장소의 테스트 스크립트이므로 신뢰하는 체크아웃에서만 명시적으로 실행하세요.

## 인증과 데이터 보관

- 관찰 데이터·토큰은 Git에서 제외된 `.local-observer/`에 저장합니다. POSIX에서는 디렉터리 0700, 파일 0600입니다. Windows에서는 사용자 계정 ACL도 적절히 관리하세요.
- HTTP 조회 API는 인증된 GET만 허용합니다. 변경 API가 없고 CLI만 저널을 작성합니다. 동일 OS 계정이 저널을 수정하는 것까지 막지는 않습니다.
- 세션은 HttpOnly·SameSite=Strict 쿠키, 1시간 유효, 메모리 보관입니다. 로컬 HTTP라 Secure 쿠키를 사용할 수 없으며 TLS 없는 외부 노출을 지원하지 않습니다.
- CORS 미허용, Host/Origin 검사, CSP, no-store, 외부 리소스 없음. 토큰은 번들·URL·브라우저 저장소에 보관하지 않습니다.
- 5초마다 관찰 화면만 폴링하며 인증·연결 실패 시 직원 상태를 숨기고 stale 데이터를 현재 작업으로 표시하지 않습니다.
- 이 서버는 `local/`의 고정된 세 파일만 제공합니다. 저널·토큰·저장소 파일을 HTTP로 내려주지 않습니다. 사용자 입력은 `textContent`로 출력합니다.
- `npm run build` 결과에는 이 화면·서버·저널이 들어가지 않습니다. `.github/workflows`는 `dist`만 Pages에 배포합니다.

기록 삭제는 서버를 종료한 뒤 `.local-observer/events.jsonl`을 로컬에서 삭제하세요. 공개 저장소에 관찰 기록을 추가하지 마세요. 파일 이름·커밋 ID·업무 요약도 비공개 정보가 될 수 있습니다.
