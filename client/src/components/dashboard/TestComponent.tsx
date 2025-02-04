import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface TestState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  showResult: boolean;
  loading: boolean;
  error: string | null;
  selectedAnswer: string | null;
  showFeedback: boolean;
  explanation: string | null;
  loadingExplanation: boolean;
  selectedCategory: string | null;  // New field for category selection
}

// Category configuration
const CATEGORIES = {
  Film: { 
    id: '11', 
    label: 'Movie Trivia', 
    description: 'Test your knowledge about movies!', 
    icon: '/Assets/movies_category_icon.png' 
  },
  Music: { 
    id: '12', 
    label: 'Music Trivia', 
    description: 'Challenge your music expertise!', 
    icon: '/Assets/music_category_icon.png' 
  },
  Books: { 
    id: '10', 
    label: 'Book Trivia', 
    description: 'Show off your literary wisdom!', 
    icon: '/Assets/books_category_icon.png' 
  }
};


const TestComponent: React.FC = () => {
  const [state, setState] = useState<TestState>({
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    showResult: false,
    loading: false,
    error: null,
    selectedAnswer: null,
    showFeedback: false,
    explanation: null,
    loadingExplanation: false,
    selectedCategory: null
  });

  const { user } = useAuth();

  // Keep all existing helper functions (fetchExplanation, handleAnswer, getCurrentQuestion, shuffleAnswers)...
  const fetchExplanation = async (question: string, correctAnswer: string) => {
    setState(prev => ({ ...prev, loadingExplanation: true }));
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      const response = await axios.post(`${API_URL}/api/openai/explain`, {
        question,
        answer: correctAnswer
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setState(prev => ({
        ...prev,
        explanation: response.data.explanation,
        loadingExplanation: false
      }));
    } catch (error) {
      console.error('Explanation error:', error);
      setState(prev => ({
        ...prev,
        explanation: 'Failed to get explanation. Please try again.',
        loadingExplanation: false
      }));
    }
  };

  const handleAnswer = async (answer: string) => {
    const currentQuestion = getCurrentQuestion();
    const isCorrect = answer === currentQuestion.correct_answer;
    
    setState(prev => ({
      ...prev,
      selectedAnswer: answer,
      showFeedback: true,
      score: isCorrect ? prev.score + 1 : prev.score
    }));

    await fetchExplanation(currentQuestion.question, currentQuestion.correct_answer);
  };

  const getCurrentQuestion = () => {
    return state.questions[state.currentQuestionIndex];
  };

  const shuffleAnswers = (question: Question) => {
    const answers = [...question.incorrect_answers, question.correct_answer];
    return answers.sort(() => Math.random() - 0.5);
  };

  // Modified fetchQuestions to use category
  const fetchQuestions = async (category: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const categoryId = CATEGORIES[category as keyof typeof CATEGORIES].id;
      const response = await axios.get(`https://opentdb.com/api.php?amount=10&category=${categoryId}`);
      if (response.data.results) {
        setState(prev => ({
          ...prev,
          questions: response.data.results,
          loading: false,
          selectedCategory: category
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to fetch questions. Please try again.'
      }));
    }
  };

  const handleStartTest = (category: string) => {
    fetchQuestions(category);
  };

  const handleRetry = () => {
    setState({
      questions: [],
      currentQuestionIndex: 0,
      score: 0,
      showResult: false,
      loading: false,
      error: null,
      selectedAnswer: null,
      showFeedback: false,
      explanation: null,
      loadingExplanation: false,
      selectedCategory: null
    });
  };

  // Keep all existing helper functions (decodeHtml, getAnswerButtonClass, renderLearningPoint)...
  const decodeHtml = (html: string) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const getAnswerButtonClass = (answer: string) => {
    if (!state.showFeedback) {
      return "w-full text-left p-3 rounded border border-gray-300 hover:bg-gray-50";
    }

    const currentQuestion = getCurrentQuestion();
    const isSelected = answer === state.selectedAnswer;
    const isCorrect = answer === currentQuestion.correct_answer;

    if (isCorrect) {
      return "w-full text-left p-3 rounded border border-green-500 bg-green-50 text-green-700";
    }
    if (isSelected && !isCorrect) {
      return "w-full text-left p-3 rounded border border-red-500 bg-red-50 text-red-700";
    }
    return "w-full text-left p-3 rounded border border-gray-300 opacity-50";
  };

  const renderLearningPoint = () => {
    if (!state.showFeedback) return null;

    const currentQuestion = getCurrentQuestion();
    
    return (
      <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-lg">
        <div className="mb-4">
          <p className="font-semibold">Learning Point:</p>
          <p>The correct answer was: {decodeHtml(currentQuestion.correct_answer)}</p>
        </div>

        {state.loadingExplanation ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-blue-200 rounded w-3/4"></div>
            <div className="h-4 bg-blue-200 rounded w-1/2"></div>
          </div>
        ) : state.explanation ? (
          <div className="mt-4">
            <p className="font-semibold">Detailed Explanation:</p>
            <p className="text-sm mt-2 leading-relaxed">{state.explanation}</p>
          </div>
        ) : null}
      </div>
    );
  };

  const handleNextQuestion = () => {
    const isLastQuestion = state.currentQuestionIndex === state.questions.length - 1;
    
    if (isLastQuestion) {
      handleTestCompletion();
    }
    
    setState(prev => ({
      ...prev,
      currentQuestionIndex: prev.currentQuestionIndex + 1,
      showResult: isLastQuestion,
      selectedAnswer: null,
      showFeedback: false,
      explanation: null
    }));
  };

  // Modified handleTestCompletion to use selected category
  const handleTestCompletion = async () => {
    if (!user?.id || !state.selectedCategory) {
      console.log('No user ID or category found, cannot save score');
      return;
    }
  
    const correctAnswers = state.score;
    const wrongAnswers = state.questions.length - state.score;
  
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const token = localStorage.getItem('token');
      
      await axios.post(
        `${API_URL}/api/test/score`,
        {
          userId: user.id,
          category: state.selectedCategory,
          score: state.score,
          totalQuestions: state.questions.length,
          correctAnswers,
          wrongAnswers
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error('Failed to save score:', error);
    }
  };

  // New component to render category selection
  const renderCategorySelection = () => {
    return (
      <div className="text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(CATEGORIES).map(([category, { label, description, icon }]) => (
            <button
              key={category}
              onClick={() => handleStartTest(category)}
              className="text-primary-200 hover:bg-secondary-200 transition-transform duration-200 hover:scale-105 px-6 py-4 rounded-lg shadow-sm flex flex-col items-center"
            ><p className="mb-2">{description}</p>
              <img src={icon} alt={`${label} icon`} className="w-32 h-24 mb-2" />
              
            </button>
          ))}
        </div>
      </div>
    );
  };
  

  // Modified renderContent to include category selection
  const renderContent = () => {
    if (state.loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading questions...</div>
        </div>
      );
    }

    if (state.error) {
      return (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {state.error}
          <button
            onClick={handleRetry}
            className="ml-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (state.showResult) {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Test Complete!</h2>
          <p className="text-lg mb-4">
            Your {state.selectedCategory} score: {state.score} out of {state.questions.length}
          </p>
          <button
            onClick={handleRetry}
            className="bg-secondary-200 text-primary-200 px-6 py-2 rounded hover:bg-secondary-100"
          >
            Try Another Category
          </button>
        </div>
      );
    }

    if (state.questions.length === 0) {
      return renderCategorySelection();
    }

    const currentQuestion = getCurrentQuestion();
    const answers = shuffleAnswers(currentQuestion);

    return (
      <div>
        <div className="mb-4">
          <span className="text-sm text-gray-500">
            Question {state.currentQuestionIndex + 1} of {state.questions.length}
          </span>
          <div className="h-2 bg-gray-200 rounded mt-2">
            <div 
              className="h-full bg-blue-500 rounded"
              style={{ width: `${((state.currentQuestionIndex + 1) / state.questions.length) * 100}%` }}
            />
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-4">
          {decodeHtml(currentQuestion.question)}
        </h3>

        <div className="space-y-3">
          {answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => !state.showFeedback && handleAnswer(answer)}
              disabled={state.showFeedback}
              className={getAnswerButtonClass(answer)}
            >
              {decodeHtml(answer)}
              {state.showFeedback && answer === currentQuestion.correct_answer && (
                <span className="ml-2 text-green-600">✓ Correct Answer</span>
              )}
              {state.showFeedback && answer === state.selectedAnswer && answer !== currentQuestion.correct_answer && (
                <span className="ml-2 text-red-600">✗ Incorrect</span>
              )}
            </button>
          ))}
        </div>

        {renderLearningPoint()}

        {state.showFeedback && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleNextQuestion}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              {state.currentQuestionIndex === state.questions.length - 1 ? 'See Results' : 'Next Question'}
            </button>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-500">
          Score: {state.score}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-primary-100 rounded-lg shadow-sm">
      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default TestComponent;