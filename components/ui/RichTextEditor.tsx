import React from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// Define the modules for the toolbar
const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [""] }],
    [{ size: [""] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "video"],
    ["clean"],
    [{ align: ["center", "right", "justify"] } as { align: string[] }],
    ["code-block"],
  ],
  clipboard: {
    matchVisual: false,
  },
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
  "align",
];

interface RichTextEditorProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  id,
  value,
  onChange,
  required = false,
  className = "",
}) => {
  return (
    <div className={className}>
      <ReactQuill
        id={id}
        value={value}
        onChange={onChange}
        theme="snow"
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default RichTextEditor;
