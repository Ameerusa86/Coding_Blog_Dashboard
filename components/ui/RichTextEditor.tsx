import React from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

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
      <ReactQuill id={id} value={value} onChange={onChange} theme="snow" />
    </div>
  );
};

export default RichTextEditor;
