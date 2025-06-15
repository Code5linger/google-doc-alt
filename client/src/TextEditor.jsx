import { useCallback, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { io } from 'socket.io-client';
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router';

const SAVE_INTERVAL_TIME = 2000;

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
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();

  console.log(documentId);

  useEffect(() => {
    const soc = io('http://localhost:5174');
    setSocket(soc);

    return () => {
      soc.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once('load-document', (document) => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit('get-document', documentId);
  }, [socket, quill, documentId]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const interval = setInterval(() => {
      socket.emit('save-document', quill.getContents());
    }, SAVE_INTERVAL_TIME);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  const quillRef = useRef(null);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null || quillRef.current) return;

    wrapper.innerHTML = '';

    const editor = document.createElement('div');
    wrapper.append(editor);

    const q = new Quill(editor, {
      theme: 'snow',
      modules: {
        toolbar: toolbarOptions,
      },
    });

    // q.enable(false);
    q.disable();
    q.setText('Loading...');
    setQuill(q);
  }, []);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== 'user') return;

      socket.emit('send-changes', delta);
    };

    quill.on('text-change', handler);

    return () => {
      quill.off('text-change', handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta) => {
      quill.updateContents(delta);
    };

    socket.on('receive-changes', handler);
    return () => {
      socket.off('receive-changes', handler);
    };
  }, [socket, quill]);

  return <div className="container" ref={wrapperRef}></div>;
};

export default TextEditor;
