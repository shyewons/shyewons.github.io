---
title: 작은 게시판 하나로 프론트와 백엔드의 경계를 이해했다
description: Express와 MongoDB로 API를 만들고 Next.js를 연결하며 웹서비스의 데이터 흐름을 익힌 이틀간의 게시판 프로젝트 회고입니다.
publishedAt: 2026-09-01
category: 개념 정리
tags: [Next.js, React, Express, MongoDB, Mongoose, JWT]
draft: false
---

## 이 프로젝트에서 얻고 싶었던 것

이번 프로젝트를 시작할 때 목표는 완성도 높은 게시판을 만드는 것이 아니었다. 학원 수업에서 따로 배운 React, Next.js, Express, MongoDB, Mongoose, JWT가 실제 웹서비스 안에서 **어떤 순서로 만나고, 데이터가 그 사이를 어떻게 이동하는지** 내 손으로 한 번 연결해 보고 싶었다.

그래서 기능을 늘리거나 화면을 꾸미기보다 게시글 목록·상세보기·작성·삭제와 회원가입·로그인에만 집중했다. 첫날에는 Express와 MongoDB로 API와 데이터 저장, JWT 인증을 구현했고, 둘째 날에는 Next.js 화면에서 그 API를 호출해 응답을 state에 반영했다.

이틀 동안 따라간 핵심 흐름은 하나였다.

```text
사용자 이벤트
→ React 화면
→ Axios로 HTTP 요청
→ Express 미들웨어
→ Router
→ Mongoose Model
→ MongoDB
→ HTTP 응답
→ React state 변경
→ 재렌더링
```

작은 CRUD 게시판이었지만 이 흐름을 처음부터 끝까지 직접 겪으면서 `useState`, `useEffect`, `req`, `res`, `next()`, `await`, `lean()`, JWT처럼 따로 외우고 있던 개념들이 하나의 웹서비스 안에서 연결되기 시작했다. 이 프로젝트는 거대한 결과물을 보여주기 위한 작업이라기보다, **프론트엔드와 백엔드의 경계를 이해하기 시작한 시점을 기록한 학습 프로젝트**다.

아래에는 그 과정에서 역할을 구분하고, 오류의 원인을 찾아 해결하며 이해하게 된 내용을 순서대로 정리했다.

## 1. 어떤 프로젝트로 시작해야 하는지도 헷갈렸다

첫날 목표는 서버 구현과 테스트였다. 그런데 프로젝트를 만들기 전부터 React, Node.js, Express, Next.js 중 무엇으로 시작해야 하는지 헷갈렸다. 먼저 각 기술의 역할을 다시 정리했다.

```text
React   → 프론트엔드 라이브러리
Node.js → 브라우저 밖에서 JavaScript를 실행하는 런타임
Express → Node.js에서 서버와 API를 만드는 웹 프레임워크
Next.js → 화면, 라우팅, 서버 기능을 제공하는 React 프레임워크
```

첫날에는 서버를 직접 구현하는 것이 목적이었기 때문에 Express 서버를 별도로 만들고, 다음 날 Next.js 프론트를 연결했다. 이 선택 덕분에 프론트와 백엔드가 HTTP를 통해 분리되어 통신한다는 점을 더 선명하게 볼 수 있었다.

## 2. Express와 Mongoose의 역할을 구분했다

서버에는 Express, Mongoose, CORS를 설치하고 역할에 따라 폴더를 나눴다.

```text
backend/
├─ app.js
├─ db.js
├─ models/
│  ├─ board_model.js
│  └─ member_model.js
├─ routes/
│  ├─ board_router.js
│  └─ member_router.js
└─ test.http
```

- `app.js`: 서버 시작, 공통 미들웨어, Router 연결
- `db.js`: MongoDB 연결
- `models/`: 데이터 구조와 DB 작업을 위한 Mongoose Model
- `routes/`: URL과 HTTP Method에 따른 요청 처리

Mongoose를 단순한 MongoDB 연결 라이브러리로 생각했지만, 직접 CRUD를 만들어 보면서 Model을 중심으로 MongoDB 작업을 다루는 ODM이라는 점이 명확해졌다.

## 3. `Board.find()`는 게시글 배열이 아니었다

처음 게시글 목록 API를 만들 때 `Board.find()`의 반환값을 그대로 JSON 응답에 넣었다.

```js
router.get(['/list', '/'], (req, res) => {
  const list = Board.find();
  res.json({ success: true, msg: list });
});
```

그러자 `TypeError: Converting circular structure to JSON` 오류가 발생했다. `Board.find()`는 게시글 배열이 아니라 DB 조회 작업을 나타내는 Mongoose Query 객체를 반환한다. 실제 결과를 기다리도록 코드를 수정했다.

```js
router.get(['/list', '/'], async (req, res) => {
  const list = await Board.find().lean();
  return res.json({ success: true, data: list });
});
```

`await Board.find()`는 Mongoose Document 배열을, `await Board.find().lean()`은 일반 JavaScript 객체 배열을 반환한다. 목록 조회처럼 데이터를 읽어 JSON으로 전달하기만 하는 경우 `lean()`이 자연스럽다는 것도 체감했다.

## 4. 요청을 받았다면 응답을 보내야 한다

게시글 작성 API에서 `req`만 출력하고 응답을 보내지 않았더니 클라이언트가 계속 로딩됐다. 서버가 요청을 받았어도 클라이언트에 응답하지 않으면 요청은 끝나지 않는다.

```js
router.post('/write', async (req, res) => {
  return res.json({ success: true, data: req.body });
});
```

![게시글 작성 API 요청과 JSON 응답](/images/notes/board-project/write-api-response.png)

이 과정에서 `req`는 클라이언트가 서버로 보낸 요청 정보이고, `res`는 서버가 클라이언트로 보낼 응답이라는 점이 분명해졌다.

또한 `res.json()`은 HTTP 응답을 전송하지만 **JavaScript 함수 실행 자체를 자동으로 종료하지는 않는다.** 이후 코드가 실행되어 중복 응답이 생길 수 있다면 `return res.json(...)`처럼 명시적으로 반환하는 편이 안전하다.

## 5. JWT를 붙이며 미들웨어를 이해했다

회원가입과 로그인까지 구현하면서 JWT 인증을 추가했다. 로그인에 성공하면 서버가 JWT를 발급하고, 프론트는 토큰을 `sessionStorage`에 저장했다. 게시글 API를 호출할 때는 토큰을 `Authorization` 헤더에 담았다.

서버에서는 `/board` 요청이 Router에 들어가기 전에 미들웨어에서 토큰을 검사했다.

```js
app.use('/board', (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.json({ success: false, message: '토큰이 없습니다.' });
  }

  try {
    jwt.verify(token, process.env.SECRET);
    next();
  } catch (error) {
    return res.json({ success: false, message: '유효하지 않은 토큰입니다.' });
  }
});
```

```text
요청 → 인증 미들웨어 → JWT 검증 성공 → next() → board Router
```

예전에는 미들웨어를 단순히 `app.use()`로 등록하는 함수라고 생각했다. 이번에는 최종 라우트 핸들러에 도달하기 전 요청을 가공하거나 검사하는 중간 처리 함수라는 점을 이해했다.

JWT 검증 과정에서는 `jsonwebtoken`을 불러오지 않아 `jwt is not defined` 오류도 만났다. 토큰의 이동 경로를 프론트, 요청 헤더, 서버의 `req.headers.authorization`, `jwt.verify()` 순으로 확인하면서 원인을 찾았다.

![JWT 검증 과정에서 만난 jwt is not defined 오류](/images/notes/board-project/jwt-debug-error.png)

JWT payload에는 비밀번호 같은 민감한 값을 넣지 않고 필요한 식별 정보만 담는 방향이 맞다는 점도 리팩터링 항목으로 남겼다.

## 6. Next.js를 붙이며 state와 effect를 다시 이해했다

둘째 날에는 Next.js 프로젝트에서 Express API를 호출했다. 처음에는 일반 변수에 목록 결과를 넣었지만, 값이 바뀌어도 React는 화면을 다시 그리지 않았다.

```js
const [list, setList] = useState([]);

useEffect(() => {
  loadList();
}, []);
```

API 응답을 받은 뒤 `setList()`를 호출하자 state 변경을 React가 감지하고 목록을 다시 렌더링했다.

```text
API 응답 → setList() → state 변경 → React가 변경 감지 → 재렌더링
```

상세 페이지에서는 동적 라우트의 `params`에서 게시글 ID를 받아 API 요청에 사용했다. `board`는 요청 결과이고, 실제 요청의 기준은 `params`라는 점을 구분하면서 `useEffect` 의존성도 더 잘 이해하게 됐다.

## 7. 클라이언트와 서버의 데이터 형식이 맞아야 한다

게시글 작성은 향후 파일 첨부를 고려해 `FormData`로 구현했다. `console.log(formData)`만으로는 내부 값이 보이지 않아 처음에는 데이터가 담기지 않은 줄 알았지만, `formData.entries()`를 순회하니 값은 정상적으로 들어 있었다.

진짜 문제는 서버였다. `express.json()`은 JSON body를 처리하지만 `multipart/form-data`는 별도로 파싱해야 한다. `multer`를 설치하고 작성 라우트에 `upload.none()`을 추가했다.

```js
router.post('/write', upload.none(), async (req, res) => {
  // req.body를 사용하는 게시글 저장 로직
});
```

이 경험을 통해 프론트에서 데이터를 보냈는지만 볼 것이 아니라, 클라이언트가 어떤 `Content-Type`으로 보냈고 서버에 그 형식을 처리할 미들웨어가 있는지까지 확인해야 한다는 것을 배웠다.

게시글이 MongoDB에 저장된 결과도 직접 확인했다.

![MongoDB에 저장된 테스트 게시글](/images/notes/board-project/mongodb-saved-document.png)

## 8. 가장 많이 사용한 도구는 `console.log`였다

이번 프로젝트에서 가장 자주 사용한 도구는 새로운 라이브러리가 아니라 `console.log`였다. JWT가 검증되지 않을 때는 데이터가 이동하는 지점을 순서대로 확인했고, FormData가 비어 있는지도 직접 순회해 확인했다.

오류가 났을 때 코드를 통째로 바꾸기보다 **데이터가 어디까지 정상적으로 흘러왔는지 한 단계씩 확인하는 방식**이 중요하다는 것을 느꼈다.

## 9. 프론트와 백엔드를 한 저장소에서 관리했다

처음에는 백엔드 프로젝트만 GitHub에 올려 저장소 루트가 Express 프로젝트였다. 둘째 날 Next.js를 붙이면서 구조를 다시 나눴다.

```text
yeardream_board/
├─ backend/  → Express + MongoDB
├─ frontend/ → Next.js
└─ .gitignore
```

프론트와 백엔드는 같은 저장소 안에 있지만 각각 별도의 애플리케이션으로 실행된다. 저장소 구조를 직접 바꿔 본 것도 이번 프로젝트에서 얻은 경험이었다.

## 다음 단계

이번에는 데이터 흐름을 이해하는 데 집중했다. 다음 프로젝트에서는 이 경험을 바탕으로 코드 중복을 줄이고, 인증 처리와 API 응답 구조를 더 일관되게 정돈해 볼 생각이다.

## 사용 기술

- Frontend: Next.js, React, Axios
- Backend: Node.js, Express, Mongoose, Multer, JSON Web Token
- Database: MongoDB

## 관련 자료

- [yeardream_board GitHub 저장소](https://github.com/shyewons/yeardream_board)
