import { Outlet } from 'react-router';

const Document = () => {
  return (
    <div>
      {/* optional layout */}
      <Outlet />
    </div>
  );
};

export default Document;
