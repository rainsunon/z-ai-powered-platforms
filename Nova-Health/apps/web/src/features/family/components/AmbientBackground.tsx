import React from 'react';

export function AmbientBackground() {
  return (
    <>
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-container/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="fixed bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-secondary-fixed/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
    </>
  );
}
