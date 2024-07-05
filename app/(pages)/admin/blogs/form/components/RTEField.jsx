import { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { useBlogForm } from "../context/BlogFormContext";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "video"],
    ["clean"],
    ["code-block"],
    [
      { align: [] },
      { align: "center" },
      { align: "right" },
      { align: "justify" },
    ],
    [{ color: [] }, { background: [] }],
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  "image",
  "video",
  "code-block",
  "align",
  "color",
  "background",
];

export function RTEField() {
  const { data, handleData } = useBlogForm();
  const handleChange = (value) => {
    handleData("content", value);
  };
  return (
    <ReactQuill
      theme="snow"
      value={data.content || ""}
      onChange={handleChange}
      modules={modules}
      formats={formats}
      placeholder="Write something awesome..."
    />
  );
}
