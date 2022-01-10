export class NoticeService {
  constructor() {}

  noticeToSlack(comment: string) {
    return fetch("/api/notice", {
      method: "POST",
      mode: "same-origin",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ message: comment }),
    }).then((res) => res.json());
  }
}
