import { News } from "@/type/news";

/**
 * 뉴스 로그 기록
 */
export async function recordNewsLog(newsId: string): Promise<void> {
  const res = await fetch(`/proxy/newsLogs/record?newsId=${newsId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`뉴스 로그 기록 실패: ${res.status}`);
  }
}

/**
 * 스크랩 뉴스 가져오기
 */
export async function fetchScrapNews(
  memberId: string
): Promise<{ data: News[] }> {
  const res = await fetch(`/proxy/scrap?memberId=${memberId}`);

  if (!res.ok) {
    throw new Error(`스크랩 뉴스 로드 실패: ${res.status}`);
  }

  return res.json();
}

/**
 * 뉴스 스크랩 생성
 */
export async function createScrap(
  memberId: string,
  newsId: string
): Promise<void> {
  const res = await fetch(`/proxy/scrap`, {
    method: "POST",
    body: JSON.stringify({
      memberId,
      newsId,
    }),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`스크랩 생성 실패: ${res.status}`);
  }
}

/**
 * 뉴스 스크랩 삭제
 */
export async function deleteScrap(
  memberId: string,
  newsId: string
): Promise<void> {
  const res = await fetch(`/proxy/scrap`, {
    method: "DELETE",
    body: JSON.stringify({
      memberId,
      newsId,
    }),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`스크랩 삭제 실패: ${res.status}`);
  }
}

/**
 * 사용자 계정 중복 확인
 */
export async function checkUserDuplicate(account: string): Promise<boolean> {
  const res = await fetch(`/proxy/auth/duplicate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ account }),
  });

  return res.ok;
}
