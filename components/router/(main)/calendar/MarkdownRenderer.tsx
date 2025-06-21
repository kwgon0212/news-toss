"use client";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";

const MarkdownRenderer = ({ markdown }: { markdown: string }) => {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    const renderMarkdown = async () => {
      // const isHtml = /<\/?[a-z][\s\S]*>/i.test(markdown);

      const rawHtml = await marked(markdown, {
        breaks: true,
      });

      const cleanHtml = DOMPurify.sanitize(rawHtml, {
        ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "img", "p", "br"],
        ALLOWED_ATTR: ["href", "src", "alt", "target"],
      });

      setHtml(cleanHtml);
    };

    renderMarkdown();
  }, [markdown]);

  // useEffect(() => {
  //   const renderMarkdown = async () => {
  //     const rawHtml = await marked(markdown);

  //     const cleanHtml = DOMPurify.sanitize(rawHtml, {
  //       ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "img", "p", "br"],
  //       ALLOWED_ATTR: ["href", "src", "alt", "target"],
  //     });

  //     console.log(cleanHtml);
  //     setHtml(cleanHtml);
  //   };

  //   renderMarkdown();
  // }, [markdown]);

  return (
    <div
      className="prose max-w-[80%] w-fit bg-gray-100 px-3 py-2 rounded-main break-keep"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MarkdownRenderer;
