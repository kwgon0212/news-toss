"use client";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";

const MarkdownRenderer = ({ message }: { message: string }) => {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    const renderMarkdown = async () => {
      const cleanHtml = DOMPurify.sanitize(message, {
        ALLOWED_TAGS: [
          "b",
          "i",
          "em",
          "strong",
          "a",
          "img",
          "p",
          "br",
          "ul",
          "li",
          "ol",
        ],
        ALLOWED_ATTR: [
          "href",
          "src",
          "alt",
          "target",
          "style",
          "width",
          "height",
        ],
      });

      setHtml(cleanHtml);
    };

    renderMarkdown();
  }, [message]);

  console.log(html);
  console.log(message);

  return (
    <div
      className="font-[inherit] max-w-[80%] w-fit bg-gray-100 px-3 py-2 rounded-main break-keep overflow-x-hidden"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MarkdownRenderer;
