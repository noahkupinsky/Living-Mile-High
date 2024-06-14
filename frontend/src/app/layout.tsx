import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <header>
        <h1>My Site</h1>
      </header>
      <main>{children}</main>
      <footer>
        <p>© 2024 My Site</p>
      </footer>
    </div>
  );
};

export default Layout;