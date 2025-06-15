import { useCallback, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const toolbarOptions = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['bold', 'italic', 'underline'],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ align: [] }],
  ['image', 'blockquote', 'code-block'],
  ['clean'],
];

const TextEditor = () => {
  const quillRef = useRef(null); // store Quill instance

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null || quillRef.current) return;

    wrapper.innerHTML = '';

    const editor = document.createElement('div');
    wrapper.append(editor);

    quillRef.current = new Quill(editor, {
      theme: 'snow',
      modules: {
        toolbar: toolbarOptions,
      },
    });
  }, []);

  return <div className="container" ref={wrapperRef}></div>;
};

export default TextEditor;
