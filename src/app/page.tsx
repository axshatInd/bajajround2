'use client';
import { useState } from 'react';
import LoginForm from '@/components/LoginForm';
import DynamicForm from '@/components/DynamicForm';

export default function Home() {
  const [loggedInRollNumber, setLoggedInRollNumber] = useState<string | null>(null);

  const handleLogin = (rollNumber: string) => {
    setLoggedInRollNumber(rollNumber);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      {loggedInRollNumber ? (
        <DynamicForm rollNumber={loggedInRollNumber} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </main>
  );
}
