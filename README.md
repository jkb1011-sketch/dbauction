# DB Auction

대화형 AI 부동산 경매 플랫폼.

- 공개 가입 없음. 관리자가 계정(임시 비밀번호)을 만들어 전달
- 홈이 곧 대화 화면
- 파일은 질문창 위 별도 버튼
- AI 키는 사용자가 내 계정에 직접 저장 (운영자 키 불필요)

## 로컬 실행

```bash
npm install
npm run dev
```

관리자 최초 계정

- 이메일: admin@dbauction.ai.kr
- 비밀번호: dbauction-admin

로그인 후 /admin 에서 회원을 추가하고, /account 에서 본인 AI 키를 저장하세요.

## 버셀 배포 후 도메인 연결

1. 이 폴더를 GitHub 저장소에 올립니다.
2. vercel.com 에서 Add New Project → 그 저장소를 Import 합니다.
3. Environment Variables는 비워 두어도 됩니다. (사용자 키 사용)
4. 배포가 끝나면 Vercel 프로젝트 → Settings → Domains
5. 예전 프로젝트에 dbauction.ai.kr 이 있으면 그 프로젝트에서 도메인을 제거합니다.
6. 새 프로젝트에 dbauction.ai.kr 과 www.dbauction.ai.kr 을 추가합니다.
7. 가비아 네임서버는 그대로 두고, A/CNAME이 Vercel을 가리키면 됩니다.
