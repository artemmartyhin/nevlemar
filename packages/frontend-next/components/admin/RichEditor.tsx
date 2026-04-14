'use client';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    [{ align: [] }],
    ['clean'],
  ],
};

export default function RichEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="quill-dark rounded-xl overflow-hidden border border-nv-cream">
      <ReactQuill theme="snow" value={value} onChange={onChange} modules={modules} />
    </div>
  );
}
