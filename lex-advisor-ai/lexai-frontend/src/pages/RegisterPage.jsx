import React from 'react';
import { SignUp } from "@clerk/clerk-react";

const RegisterPage = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      {}
      <SignUp 
        routing="hash" 
        forceRedirectUrl="/chat" 
      />
    </div>
  );
};

export default RegisterPage;