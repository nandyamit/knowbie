import { ApiResponse, TestAttempt } from "../types/auth";

export const fetchUserTestAttempts = async (userId: number): Promise<TestAttempt[]> => {
  try {
    const response = await fetch(`/api/test-attempts?userId=${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch test attempts");
    }
    const result: ApiResponse<TestAttempt[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};
