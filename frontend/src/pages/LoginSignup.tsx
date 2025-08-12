import React from 'react';
import Card from '../components/ui/Card';

const googleLogo = 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg';
const microsoftLogo = 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg';

const LoginSignup: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
      <Card className="p-8 min-w-[320px] text-center">
        <h1 className="text-2xl font-bold mb-2">Welcome</h1>
        <p className="text-gray-500 mb-6">
          Sign in to My Application Tracker
        </p>
        
        <div className="space-y-3">
          <a
            href="http://localhost:3000/auth/google"
            className="flex items-center w-full px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <img src={googleLogo} alt="Google" className="w-5 h-5 mr-3" />
            <span className="text-gray-700 font-medium">Continue with Google</span>
          </a>

          <a
            href="http://localhost:3000/auth/microsoft"
            className="flex items-center w-full px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <img src={microsoftLogo} alt="Microsoft" className="w-5 h-5 mr-3" />
            <span className="text-gray-700 font-medium">Continue with Microsoft</span>
          </a>
        </div>

        <p className="mt-6 text-sm text-gray-400">
          By signing in, you agree to our{' '}
          <a href="/terms" className="text-blue-500 hover:text-blue-600">
            Terms
          </a>
          .
        </p>
      </Card>
    </div>
  );
};

export default LoginSignup;
