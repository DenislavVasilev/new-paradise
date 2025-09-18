import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="flex items-center justify-center p-4 bg-red-50 text-red-700 rounded-lg">
      <AlertTriangle className="w-5 h-5 mr-2" />
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;