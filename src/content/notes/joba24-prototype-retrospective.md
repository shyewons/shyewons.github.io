---
title: 잡아24 시안 개발기
description: 고용24 해커톤에서 공고 탐색부터 매칭과 피드백까지, 잡아24의 기획을 작동하는 웹 시안으로 옮기며 정한 화면과 동작의 규칙을 기록했습니다.
publishedAt: 2026-10-14
category: 기술 선택
tags: [해커톤, HTML, CSS, JavaScript, UX, 프로토타입]
draft: false
---

## 구직자와 기업이 서로의 이유를 알 수 있다면

고용24 해커톤에서 팀원들과 함께 ‘잡아24’라는 채용 서비스를 기획했다. 구직자는 지원 결과를 받아도 무엇을 보완해야 할지 알기 어렵고, 기업은 공고가 선택받지 못하는 이유를 파악하기 어렵다는 문제에서 출발했다.

잡아24는 공고 카드를 밀고 당기며 일자리를 탐색하고, 서로 선택하지 않은 이유를 피드백으로 연결하는 서비스다. 구직자는 다음 지원을 준비하고, 기업은 공고를 개선하는 데 그 정보를 활용하도록 구상했다.

나는 이 아이디어를 직접 조작할 수 있는 웹 시안으로 구현하는 일을 맡았다. **시안의 코딩 전체를 담당하면서 화면별 동작과 정보 배치, 디자인을 구체화했고, 최종 기획서에서는 서비스 소개 페이지를 작성했다.** 구현 과정에는 AI 도구도 활용했으며, 결과를 확인하면서 필요한 동작과 화면을 수정해 나갔다.

## 핵심 흐름부터 작동하게 만들기

처음부터 디자인이 모두 확정된 상태는 아니었다. 우선 제출용 시안에서 핵심 흐름을 체험할 수 있도록 기능을 구현하고, 디자인이 정리되면 개선하는 순서로 진행했다. HTML, CSS, JavaScript로 구성해 별도 빌드 없이 브라우저에서 열어볼 수 있도록 했다.

가장 먼저 구현한 것은 공고를 탐색하는 카드였다. 아래로 당기면 지원 동작으로 이어지고, 위로 밀면 공고를 넘기는 이유를 선택하도록 만들었다. 지원하면 카드가 뒤집히며 ‘플러팅을 날렸습니다’라는 안내가 나타난다. 거절할 때는 반대 방향으로 뒤집히면서 사유 선택 화면이 나온다.

<div class="joba24-gallery">
  <figure class="joba24-figure">
    <a class="joba24-capture" href="/images/notes/joba24/01-explorer.jpg" target="_blank" rel="noopener noreferrer" aria-label="공고 탐색 캡처 원본 보기 (새 탭)">
      <img src="/images/notes/joba24/01-explorer.jpg" alt="연두색 손잡이로 밀기와 당기기를 조작하는 잡아24 공고 탐색 화면" width="1265" height="900" loading="lazy" decoding="async" />
    </a>
    <figcaption>공고 카드에서 근무 조건을 확인하고, 하단 손잡이로 지원하거나 넘길 수 있다.</figcaption>
  </figure>
  <figure class="joba24-figure">
    <a class="joba24-capture" href="/images/notes/joba24/04-application-success.jpg" target="_blank" rel="noopener noreferrer" aria-label="지원 완료 캡처 원본 보기 (새 탭)">
      <img src="/images/notes/joba24/04-application-success.jpg" alt="플러팅을 날렸습니다라는 안내와 다음 공고 보기 버튼이 나타난 지원 완료 시안" width="1265" height="900" loading="lazy" decoding="async" />
    </a>
    <figcaption>당겨서 지원하면 완료 안내가 나타난다. 시안에서는 실제 지원서를 전송하지 않는다.</figcaption>
  </figure>
</div>

## 카드를 미는 순간과 거절을 확정하는 순간

카드 동작을 구현하면서 구체적으로 정해야 했던 것은 <strong>‘어느 순간에 공고 처리가 완료되는가’</strong>였다.

위로 밀었다는 이유만으로 바로 다음 공고로 넘어가면, 이유를 입력하기 전에 공고가 사라지게 된다. 그래서 카드를 미는 동작과 거절을 확정하는 동작을 나눴다.

급여, 거리, 업무, 정보 부족 등의 이유를 하나 이상 선택해야 완료할 수 있게 했고, ‘기타’를 선택하면 설명도 입력하도록 했다. 취소하면 같은 공고의 앞면으로 돌아오며 남은 공고 수는 유지된다. 사유를 입력하고 확정했을 때만 기록을 남기고 다음 카드로 이동한다.

완료 버튼의 활성화 조건뿐 아니라 상태를 변경하는 로직에서도 입력값을 검사했다. 화면에서 버튼을 누를 수 있는지와 실제로 공고를 처리할 수 있는지에 같은 기준을 적용한 것이다.

<div class="joba24-gallery">
  <figure class="joba24-figure">
    <a class="joba24-capture" href="/images/notes/joba24/02-rejection-empty.jpg" target="_blank" rel="noopener noreferrer" aria-label="사유 선택 전 캡처 원본 보기 (새 탭)">
      <img src="/images/notes/joba24/02-rejection-empty.jpg" alt="거절 사유를 선택하지 않아 완료 버튼이 비활성화된 화면" width="1265" height="900" loading="lazy" decoding="async" />
    </a>
    <figcaption>사유를 고르기 전에는 완료 버튼이 비활성화되어 있다. 이때 공고 수는 줄어들지 않는다.</figcaption>
  </figure>
  <figure class="joba24-figure">
    <a class="joba24-capture" href="/images/notes/joba24/03-rejection-selected.jpg" target="_blank" rel="noopener noreferrer" aria-label="사유 선택 후 캡처 원본 보기 (새 탭)">
      <img src="/images/notes/joba24/03-rejection-selected.jpg" alt="급여를 거절 사유로 선택해 선택 완료 다음 공고 버튼이 활성화된 화면" width="1265" height="900" loading="lazy" decoding="async" />
    </a>
    <figcaption>사유를 선택하면 확정할 수 있다. ‘다시 볼게요’를 누르면 같은 공고로 돌아간다.</figcaption>
  </figure>
</div>

카드 안에 상세 정보를 넣으면서는 스크롤과 카드 조작이 함께 존재해야 했다. 내용을 읽으려고 움직였는데 지원이나 거절로 처리되면 곤란하다.

상세 정보가 펼쳐진 상태에서는 카드 본문의 드래그를 제한하고, 손잡이에서 지원·거절을 조작하도록 구분했다. 짧게 끌었다가 놓았을 때의 취소, 중복 처리 방지, 마지막 공고 이후의 완료 화면도 함께 구현했다.

## 지원 이후에는 무엇을 보여줘야 할까

지원 이후의 흐름은 ‘나의 매칭’ 화면으로 옮겼다. 여기서는 현재 상태와 다음에 할 일을 쉽게 파악할 수 있는 구성을 고민했다. 기업 검토 중인지, 추가 서류 요청이 있는지, 면접 안내를 확인해야 하는지에 따라 보여줄 정보와 버튼이 달라져야 했다.

진행도를 보고 상황을 알 수 있다면 별도의 진행 내역 버튼은 줄일 수 있다고 생각했다. 회사명과 공고명을 중심으로 정보를 정리하고, 중복 설명을 덜어냈다. 상태별 필터와 마감 임박순 정렬도 추가했다.

제출용 시안에서는 여러 상태를 바로 비교할 수 있도록 예시 목록을 사용했고, 탐색 화면의 지원 기록과 연결하는 범위는 제외했다.

<figure class="joba24-figure">
  <a class="joba24-capture joba24-capture--matching" href="/images/notes/joba24/05-matching.jpg" target="_blank" rel="noopener noreferrer" aria-label="매칭 목록 전체 캡처 보기 (새 탭)">
    <img src="/images/notes/joba24/05-matching.jpg" alt="추가 서류 요청, 면접, 검토 대기중 상태와 각각의 진행도가 표시된 나의 매칭 화면" width="1265" height="2018" loading="lazy" decoding="async" />
  </a>
  <figcaption>추가 서류 요청과 면접 안내처럼 현재 단계와 다음 행동을 함께 보여준다. 화면은 예시 8건 중 상단 3건이며, 이미지를 누르면 전체 목록을 볼 수 있다.</figcaption>
</figure>

## 피드백은 언제 묶고 어떻게 다시 읽게 할까

피드백 화면에서는 **무엇을 언제 묶어서 보여줄지**가 중요한 질문이었다. 검토 중인 지원까지 주간 보고서에 넣으면 집계 시점이 애매해졌다.

기획상 결과가 확정된 날짜를 기준으로 묶는 방향으로 정리하고, 주간 요약 아래에서 공고별 피드백을 확인할 수 있도록 구성했다. 전체적인 경향을 먼저 보고, 개별 공고의 사유를 이어서 살펴보는 흐름이다.

보고서를 읽는 규칙도 화면과 함께 정했다. 처음 열람할 때 쿠폰 한 장을 사용하고, 이미 열람한 보고서는 추가 차감 없이 다시 볼 수 있게 했다. 쿠폰 수와 열람 상태는 `sessionStorage`에 저장해 같은 탭에서 새로고침해도 유지하도록 했다.

<div class="joba24-gallery">
  <figure class="joba24-figure">
    <a class="joba24-capture joba24-capture--list" href="/images/notes/joba24/06-feedback-list.jpg" target="_blank" rel="noopener noreferrer" aria-label="보고서 첫 열람 전 캡처 원본 보기 (새 탭)">
      <img src="/images/notes/joba24/06-feedback-list.jpg" alt="쿠폰 2장과 미열람 상태의 주간 보고서가 표시된 피드백 목록" width="1265" height="931" loading="lazy" decoding="async" />
    </a>
    <figcaption>첫 열람 전에는 쿠폰이 2장이고, 보고서에 ‘쿠폰 1장으로 열람하기’ 버튼이 표시된다.</figcaption>
  </figure>
  <figure class="joba24-figure">
    <a class="joba24-capture joba24-capture--read" href="/images/notes/joba24/08-feedback-read.jpg" target="_blank" rel="noopener noreferrer" aria-label="보고서 열람 후 캡처 원본 보기 (새 탭)">
      <img src="/images/notes/joba24/08-feedback-read.jpg" alt="첫 보고서 열람 후 쿠폰이 1장으로 줄고 열람 완료와 다시 보기 버튼이 표시된 피드백 목록" width="1265" height="926" loading="lazy" decoding="async" />
    </a>
    <figcaption>열람 후에는 쿠폰이 1장으로 줄고 ‘다시 보기’로 바뀐다. 같은 보고서를 다시 읽을 때는 차감하지 않는다.</figcaption>
  </figure>
</div>

보고서 내용과 통계는 예시 데이터다. 피드백 참여 횟수에 따라 쿠폰을 적립하는 기능은 이번 시안에 연결하지 않았으며, 목록 상단의 참여 진행률도 고정된 예시다.

<figure class="joba24-figure">
  <a class="joba24-capture joba24-capture--report" href="/images/notes/joba24/07-feedback-report.jpg" target="_blank" rel="noopener noreferrer" aria-label="주간 보고서 전체 캡처 보기 (새 탭)">
    <img src="/images/notes/joba24/07-feedback-report.jpg" alt="서류 통과와 미통과를 집계한 도넛차트 아래 공고별 판단 사유를 보여주는 주간 이력서 피드백 보고서" width="1265" height="1592" loading="lazy" decoding="async" />
  </a>
  <figcaption>주간 요약에서 공고별 사유로 이어지는 보고서. 집계 수치와 기업 피드백은 시안을 위한 예시이며, 이미지를 누르면 전체 보고서를 볼 수 있다.</figcaption>
</figure>

## 여러 화면을 하나의 서비스로 맞추기

여러 화면을 만들다 보니 공통 디자인 기준도 다시 점검하게 됐다. 비슷한 색상이 서로 다른 값으로 쓰이거나 회사명과 버튼의 크기가 달라지는 부분을 정리했다. 화면을 가리던 하단 메뉴는 사이드바로 바꾸고, 글자 크기와 여백도 조정했다.

각 페이지를 따로 볼 때뿐 아니라 페이지를 이동했을 때도 같은 서비스로 느껴지도록 맞추는 작업이었다.

최종 기획서의 서비스 소개 페이지를 맡았을 때는 구현한 화면을 통해 서비스 흐름을 설명하고자 했다. 중앙에 공고 탐색 화면을 놓고, 밀었을 때의 공고 피드백과 당겼을 때의 지원·매칭·피드백 화면으로 이어지게 구성했다.

앞에서 설명한 문제와 대상이 실제 사용자의 어떤 행동으로 연결되는지 한 장에 담는 것이 목적이었다.

<figure class="joba24-figure joba24-figure--slide">
  <a href="/images/notes/joba24/09-service-slide.png" target="_blank" rel="noopener noreferrer" aria-label="서비스 소개 슬라이드 원본 보기 (새 탭)">
    <img src="/images/notes/joba24/09-service-slide.png" alt="중앙 공고 탐색 화면에서 왼쪽 공고 피드백과 오른쪽 지원 및 이력서 피드백으로 연결한 최종 기획서 5페이지" width="1600" height="900" loading="lazy" decoding="async" />
  </a>
  <figcaption>담당한 최종 기획서 5페이지 ‘서비스 소개’. 사용자의 두 행동과 이후 흐름을 설명하고, AI 활용 계획을 함께 표시했다.</figcaption>
</figure>

## AI 활용 계획과 이번에 구현한 범위

AI 활용 방식도 검토했다. 사용자에게서 받은 이유를 해석하는 일, 공고의 추천 순서를 정하는 일, 피드백을 바탕으로 개선안을 제안하는 일은 각각 입력과 결과가 달랐다.

Laya를 어떤 역할에 활용할 수 있을지 논의했고, 기업의 불합격 판단은 담당자가 확인하고 확정하는 흐름으로 설명했다. 최종 기획서의 ‘System One’이라는 표현이 특정 Laya 모델과 버전의 도입 확정을 뜻하는 것은 아니다.

최종 기획서에는 맞춤 추천과 AI 컨설팅 계획을 담았지만, 이번 웹 시안에서 구현한 범위는 공고 탐색, 매칭 상태 확인, 피드백 보고서 등의 화면과 상호작용이다. 실제 공고 API나 추천 모델, 지원서를 전송하는 서버는 연결되어 있지 않다.

따라서 시안으로 확인한 것은 사용 흐름과 화면 동작이며, 추천 품질이나 채용 효과는 앞으로 검증해야 할 과제다.

## 짧은 기획을 구체적인 동작으로

동작 검증에서는 마우스·터치·키보드 입력과 사유 입력 조건, 취소와 재시작, 보고서 첫 열람과 재열람 등을 확인했다. 실제 서비스에서도 이 흐름이 편리한지, 거절 사유를 필수로 받는 방식이 사용자에게 얼마나 부담이 되는지는 별도의 사용자 검증이 필요하다.

‘카드를 밀고 당긴다’는 짧은 기획을 화면으로 옮기려면, 취소했을 때 어디로 돌아갈지, 언제 남은 공고 수를 줄일지, 상세 정보를 읽는 동작과 카드 조작을 어떻게 구분할지까지 정해야 했다.

이번 작업에서는 그런 규칙을 구체화하고, 팀의 아이디어를 브라우저에서 직접 확인할 수 있는 형태로 만들었다.

## 관련 자료

- [잡아24 시안 직접 체험하기](https://shyewons.github.io/job-a24/prototype/)
- [잡아24 GitHub 저장소](https://github.com/shyewons/job-a24)

<style>
  .joba24-gallery {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
    margin: 36px 0;
    align-items: start;
  }
  .joba24-figure { margin: 36px 0; }
  .joba24-gallery .joba24-figure { margin: 0; }
  .joba24-capture {
    display: block;
    position: relative;
    width: 100%;
    max-width: 430px;
    margin: 0 auto;
    aspect-ratio: 430 / 844;
    overflow: hidden;
    border-radius: 16px;
    background: #fafafa;
    box-shadow: 0 0 0 1px var(--line);
    --capture-top: -3.317535545%;
  }
  .prose .joba24-capture img {
    display: block;
    position: absolute;
    width: 294.186046512%;
    max-width: none;
    height: auto;
    left: -97.093023256%;
    top: var(--capture-top);
  }
  .joba24-capture--matching {
    aspect-ratio: 430 / 940;
    --capture-top: -2.978723404%;
  }
  .joba24-capture--list {
    aspect-ratio: 430 / 875;
    --capture-top: -3.2%;
  }
  .joba24-capture--read {
    aspect-ratio: 430 / 870;
    --capture-top: -3.218390805%;
  }
  .joba24-capture--report {
    aspect-ratio: 430 / 1030;
    --capture-top: -2.718446602%;
  }
  .joba24-figure figcaption {
    max-width: 430px;
    margin: 12px auto 0;
    color: var(--muted);
    font-size: 0.875rem;
    line-height: 1.7;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }
  .joba24-figure--slide img { display: block; width: 100%; height: auto; border-radius: 12px; }
  .joba24-figure--slide figcaption { max-width: none; }
  .joba24-figure a:focus-visible { outline: 3px solid #4e6b2a; outline-offset: 4px; }
  @media (max-width: 600px) {
    .joba24-gallery { grid-template-columns: minmax(0, 1fr); gap: 32px; }
  }
</style>
