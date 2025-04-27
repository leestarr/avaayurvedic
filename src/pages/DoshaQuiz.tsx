import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizQuestions, doshaDescriptions } from '../data/doshaQuiz';
import { DoshaResult, DohaType } from '../types';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

const DoshaQuiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, DohaType>>({});
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [result, setResult] = useState<DoshaResult>({ vata: 0, pitta: 0, kapha: 0 });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAnswer = (questionId: number, doshaType: DohaType) => {
    const updatedAnswers = { ...answers, [questionId]: doshaType };
    setAnswers(updatedAnswers);
    
    // Move to next question
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate results
      calculateResults(updatedAnswers);
    }
  };

  const calculateResults = (answersData: Record<number, DohaType>) => {
    const counts = Object.values(answersData).reduce(
      (acc, dosha) => {
        acc[dosha]++;
        return acc;
      },
      { vata: 0, pitta: 0, kapha: 0 } as Record<DohaType, number>
    );
    
    const total = quizQuestions.length;
    const vataPercentage = Math.round((counts.vata / total) * 100);
    const pittaPercentage = Math.round((counts.pitta / total) * 100);
    const kaphaPercentage = Math.round((counts.kapha / total) * 100);
    
    setResult({ vata: vataPercentage, pitta: pittaPercentage, kapha: kaphaPercentage });
    setIsQuizComplete(true);
  };

  const saveResults = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please sign in to save your results');
        navigate('/login');
        return;
      }

      // Determine primary and secondary doshas
      const doshaScores = [
        { type: 'vata' as DohaType, score: result.vata },
        { type: 'pitta' as DohaType, score: result.pitta },
        { type: 'kapha' as DohaType, score: result.kapha }
      ].sort((a, b) => b.score - a.score);

      const primaryDosha = doshaScores[0].type;
      const secondaryDosha = doshaScores[1].score > 0 ? doshaScores[1].type : null;

      // Save to dosha_quiz_results table
      const { error: quizError } = await supabase
        .from('dosha_quiz_results')
        .upsert({
          user_id: user.id,
          vata_score: result.vata,
          pitta_score: result.pitta,
          kapha_score: result.kapha,
          primary_dosha: primaryDosha,
          secondary_dosha: secondaryDosha,
          quiz_answers: answers,
        });

      if (quizError) throw quizError;

      // Update user profile with primary dosha
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          dosha_type: primaryDosha,
        });

      if (profileError) throw profileError;

      toast.success('Results saved successfully!');
      navigate('/account');
    } catch (error) {
      console.error('Error saving results:', error);
      toast.error('Failed to save results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsQuizComplete(false);
    setResult({ vata: 0, pitta: 0, kapha: 0 });
  };

  if (isQuizComplete) {
    return (
      <QuizResults 
        result={result} 
        onRestart={restartQuiz} 
        onSave={saveResults}
        loading={loading}
      />
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
  
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-emerald-900 mb-2 text-center">Discover Your Dosha</h1>
        <p className="text-gray-600 text-center mb-8">
          Answer the following questions to learn about your unique mind-body constitution.
        </p>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div 
            className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          {/* Question */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-500">
                Question {currentQuestionIndex + 1} of {quizQuestions.length}
              </span>
              <div className="flex items-center">
                <button
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className={`p-1 rounded-md ${
                    currentQuestionIndex === 0
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-emerald-700 hover:bg-emerald-50'
                  }`}
                  aria-label="Previous question"
                >
                  <ArrowLeft size={18} />
                </button>
              </div>
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-4">{currentQuestion.question}</h2>
          </div>
          
          {/* Answer Options */}
          <div className="space-y-4">
            <AnswerOption
              doshaType="vata"
              text={currentQuestion.options.vata}
              isSelected={answers[currentQuestion.id] === 'vata'}
              onSelect={() => handleAnswer(currentQuestion.id, 'vata')}
            />
            <AnswerOption
              doshaType="pitta"
              text={currentQuestion.options.pitta}
              isSelected={answers[currentQuestion.id] === 'pitta'}
              onSelect={() => handleAnswer(currentQuestion.id, 'pitta')}
            />
            <AnswerOption
              doshaType="kapha"
              text={currentQuestion.options.kapha}
              isSelected={answers[currentQuestion.id] === 'kapha'}
              onSelect={() => handleAnswer(currentQuestion.id, 'kapha')}
            />
          </div>
        </div>
        
        <div className="text-center mt-8 text-gray-500 text-sm">
          Note: This quiz provides a general assessment and is not a substitute for professional Ayurvedic consultation.
        </div>
      </div>
    </div>
  );
};

interface AnswerOptionProps {
  doshaType: DohaType;
  text: string;
  isSelected: boolean;
  onSelect: () => void;
}

const AnswerOption: React.FC<AnswerOptionProps> = ({ doshaType, text, isSelected, onSelect }) => {
  const getBgColor = () => {
    if (isSelected) {
      switch (doshaType) {
        case 'vata': return 'bg-indigo-100 border-indigo-300';
        case 'pitta': return 'bg-amber-100 border-amber-300';
        case 'kapha': return 'bg-emerald-100 border-emerald-300';
        default: return '';
      }
    }
    return 'bg-white border-gray-200 hover:bg-gray-50';
  };
  
  return (
    <button
      onClick={onSelect}
      className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${getBgColor()}`}
    >
      <p className="text-gray-800">{text}</p>
    </button>
  );
};

interface QuizResultsProps {
  result: DoshaResult;
  onRestart: () => void;
  onSave: () => void;
  loading: boolean;
}

const QuizResults: React.FC<QuizResultsProps> = ({ result, onRestart, onSave, loading }) => {
  // Determine dominant dosha
  const doshas: DohaType[] = ['vata', 'pitta', 'kapha'];
  const dominantDosha = doshas.reduce((a, b) => result[a] > result[b] ? a : b);
  
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-serif font-bold text-emerald-900 mb-4">Your Dosha Profile</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your Ayurvedic constitution is made up of all three doshas, with one or two typically being predominant. 
            Understanding your unique balance can help guide your diet, lifestyle, and wellness practices.
          </p>
        </div>
        
        {/* Result Visualization */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-12">
          <h2 className="text-2xl font-serif font-bold text-center text-emerald-900 mb-8">
            Your Dosha Matrix
          </h2>
          
          {/* Dosha Bars */}
          <div className="space-y-6 mb-8">
            <DoshaBar type="vata" percentage={result.vata} />
            <DoshaBar type="pitta" percentage={result.pitta} />
            <DoshaBar type="kapha" percentage={result.kapha} />
          </div>
          
          {/* Interpretation */}
          <div className="p-6 bg-amber-50 rounded-lg border border-amber-200">
            <h3 className="text-xl font-medium text-amber-800 mb-2">
              Your Dominant Dosha: {dominantDosha.charAt(0).toUpperCase() + dominantDosha.slice(1)}
            </h3>
            <p className="text-amber-700 mb-4">
              {doshaDescriptions[dominantDosha].shortDescription}
            </p>
            <p className="text-amber-700">
              {doshaDescriptions[dominantDosha].longDescription}
            </p>
          </div>
        </div>
        
        {/* Dosha Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <DoshaCard type="vata" percentage={result.vata} />
          <DoshaCard type="pitta" percentage={result.pitta} />
          <DoshaCard type="kapha" percentage={result.kapha} />
        </div>
        
        {/* Recommendations */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-serif font-bold text-center text-emerald-900 mb-6">
            Recommended for Your Balance
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-emerald-900 mb-4">Recommended Practices</h3>
              <ul className="space-y-3">
                {doshaDescriptions[dominantDosha].recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-emerald-700 mr-2 mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-emerald-900 mb-4">Your Characteristics</h3>
              <ul className="space-y-3">
                {doshaDescriptions[dominantDosha].characteristics.map((char: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-emerald-700 mr-2 mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{char}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-12">
          <button
            onClick={onRestart}
            disabled={loading}
            className="flex items-center justify-center px-6 py-3 bg-white border border-emerald-700 text-emerald-700 rounded-md hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={18} className="mr-2" />
            Retake Quiz
          </button>
          <button
            onClick={onSave}
            disabled={loading}
            className="flex items-center justify-center px-6 py-3 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Results'}
          </button>
        </div>
      </div>
    </div>
  );
};

interface DoshaBarProps {
  type: DohaType;
  percentage: number;
}

const DoshaBar: React.FC<DoshaBarProps> = ({ type, percentage }) => {
  const getBarColors = () => {
    switch (type) {
      case 'vata': return 'bg-indigo-500';
      case 'pitta': return 'bg-amber-500';
      case 'kapha': return 'bg-emerald-500';
      default: return '';
    }
  };
  
  const getDoshaName = () => {
    switch (type) {
      case 'vata': return 'Vata (Air & Space)';
      case 'pitta': return 'Pitta (Fire & Water)';
      case 'kapha': return 'Kapha (Earth & Water)';
      default: return '';
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-gray-700">{getDoshaName()}</span>
        <span className="font-bold text-gray-900">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div 
          className={`${getBarColors()} h-4 rounded-full transition-all duration-1000`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

interface DoshaCardProps {
  type: DohaType;
  percentage: number;
}

const DoshaCard: React.FC<DoshaCardProps> = ({ type, percentage }) => {
  const getCardStyles = () => {
    switch (type) {
      case 'vata': 
        return {
          border: 'border-indigo-200',
          bg: percentage > 30 ? 'bg-indigo-50' : 'bg-white',
          title: 'text-indigo-900',
          highlight: 'text-indigo-700'
        };
      case 'pitta': 
        return {
          border: 'border-amber-200',
          bg: percentage > 30 ? 'bg-amber-50' : 'bg-white',
          title: 'text-amber-900',
          highlight: 'text-amber-700'
        };
      case 'kapha': 
        return {
          border: 'border-emerald-200',
          bg: percentage > 30 ? 'bg-emerald-50' : 'bg-white',
          title: 'text-emerald-900',
          highlight: 'text-emerald-700'
        };
      default: return {
        border: '',
        bg: '',
        title: '',
        highlight: ''
      };
    }
  };
  
  const styles = getCardStyles();
  
  return (
    <div className={`rounded-lg border ${styles.border} ${styles.bg} p-6 transition-all`}>
      <h3 className={`text-xl font-serif font-bold mb-2 ${styles.title}`}>
        {doshaDescriptions[type].title}
      </h3>
      <p className="text-gray-700 mb-4">
        {doshaDescriptions[type].shortDescription}
      </p>
      <p className={`font-medium ${styles.highlight}`}>
        {percentage}% of your constitution
      </p>
    </div>
  );
};

export default DoshaQuiz;