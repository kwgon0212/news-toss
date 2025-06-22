import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const message = req.query.message as string;

  if (!message) {
    res.writeHead(400);
    res.end("message 쿼리 파라미터가 필요해요.");
    return;
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const upstream = await fetch("http://15.165.211.100:8000/news/chat/stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: "1234567890",
      question: message,
    }),
  });

  const reader = upstream.body?.getReader();
  const decoder = new TextDecoder("utf-8");

  if (!reader) {
    res.write("event: error\ndata: Reader 없음\n\n");
    res.end();
    return;
  }

  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");

    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim();
      if (line.startsWith("data:")) {
        const parsed = JSON.parse(line.replace(/^data:\s*/, ""));

        // 문자열을 한 글자씩 잘라서 전송
        if (parsed.content) {
          for (const char of parsed.content) {
            const chunk = JSON.stringify({ content: char });
            res.write(`data: ${chunk}\n\n`);
            (res as any).flush?.();
          }
        }

        if (parsed.is_last) {
          const endChunk = JSON.stringify({ is_last: true });
          res.write(`data: ${endChunk}\n\n`);
          res.write(`event: end\ndata: 끝났어요\n\n`);
          (res as any).flush?.();
        }
      }
    }

    // 마지막 줄은 불완전할 수 있으니 버퍼에 남기기
    buffer = lines[lines.length - 1];
  }

  res.end();
}
