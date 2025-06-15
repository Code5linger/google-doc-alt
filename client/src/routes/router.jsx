import { createBrowserRouter, Navigate } from 'react-router';
import Document from '../pages/Document';
import TextEditor from '../TextEditor';
import { v4 as uuidV4 } from 'uuid';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={`/documents/${uuidV4()}`} replace />,
  },
  {
    path: '/documents/:id',
    element: <Document />,
    children: [
      {
        index: true,
        element: <TextEditor />,
      },
    ],
  },
]);

export default router;
