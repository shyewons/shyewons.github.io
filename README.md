# dev-portfolio

Astro로 만든 개발자 포트폴리오입니다. 콘텐츠는 Markdown/MDX 기반으로 관리합니다.

## 시작하기

```bash
npm install
npm run dev
```

정적 빌드는 `npm run build`, 로컬 미리보기는 `npm run preview`를 사용합니다.

## 콘텐츠 작성

- 프로젝트: `src/content/projects/*.md`
- 개발 노트: `src/content/notes/*.md`
- 사이트 이름·링크: `src/data/site.ts`

초안은 frontmatter에 `draft: true`를 지정하면 목록과 빌드 결과에서 제외됩니다.

## GitHub Pages

기본 배포 주소는 `https://shyewons.github.io/dev-portfolio`로 설정되어 있습니다. 사용자 정의 도메인이나 저장소 이름을 변경하면 `astro.config.mjs`의 `site`와 `base`도 함께 수정하세요.
