import React, { useState, useEffect } from "react";
import { fetchUserTestAttempts } from "../../api/dashboard";
import { TestAttempt } from "../../types/auth";

interface FirstTimeUserMessageProps {
  userId: number;
}

const FirstTimeUserMessage: React.FC<FirstTimeUserMessageProps> = ({ userId }) => {
  const [isFirstTimeUser, setIsFirstTimeUser] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkUserAttempts = async () => {
      console.log("userId:", userId);  // Log the userId to check if it's correct
      try {
        const attempts: TestAttempt[] = await fetchUserTestAttempts(Number(userId));
        setIsFirstTimeUser(attempts.length === 0); // Show message only if no attempts exist
      } catch (error) {
        console.error("Error fetching test attempts:", error);
        setIsFirstTimeUser(false); // Default to false if there's an error
      } finally {
        setLoading(false); // Ensure loading stops
      }
    };
  
    if (userId) {
      checkUserAttempts();
    } else {
      setLoading(false);
    }
  }, [userId]);

  // If still loading or not a first-time user, don't show the message
  if (loading || !isFirstTimeUser) return null;

  return (
    <div className="text-primary-200 text-3xl font-bold px-4 py-3 rounded-lg mb-4 text-center">
      <p>Welcome! Take a test to get started!</p>
    </div>
  );
};

export default FirstTimeUserMessage;
