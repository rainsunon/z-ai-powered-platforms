import React from 'react';
import { SignIn } from "@clerk/clerk-react";

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <SignIn 
        routing="hash" 
        forceRedirectUrl="/chat" 
      />
    </div>
  );
};

export default LoginPage;