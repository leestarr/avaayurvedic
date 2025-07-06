import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  GripVertical,
  Save,
  X,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface QuizQuestion {
  id: string;
  question: string;
  vata_option: string;
  pitta_option: string;
  kapha_option: string;
  question_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface EditQuestion {
  id?: string;
  question: string;
  vata_option: string;
  pitta_option: string;
  kapha_option: string;
  question_order: number;
  is_active: boolean;
}

export default function AdminQuiz() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<EditQuestion | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [draggedQuestion, setDraggedQuestion] = useState<string | null>(null);
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .order('question_order', { ascending: true });

      if (error) {
        console.error('Error fetching quiz questions:', error);
        toast.error('Failed to load questions');
        return;
      }

      setQuestions(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  }

  const handleAddNew = () => {
    const newQuestion: EditQuestion = {
      question: '',
      vata_option: '',
      pitta_option: '',
      kapha_option: '',
      question_order: questions.length + 1,
      is_active: true
    };
    setEditingQuestion(newQuestion);
    setIsAddingNew(true);
  };

  const handleEdit = (question: QuizQuestion) => {
    setEditingQuestion({
      id: question.id,
      question: question.question,
      vata_option: question.vata_option,
      pitta_option: question.pitta_option,
      kapha_option: question.kapha_option,
      question_order: question.question_order,
      is_active: question.is_active
    });
    setIsAddingNew(false);
  };

  const handleSave = async () => {
    if (!editingQuestion) return;

    // Validation
    if (!editingQuestion.question.trim()) {
      toast.error('Question text is required');
      return;
    }
    if (!editingQuestion.vata_option.trim() || !editingQuestion.pitta_option.trim() || !editingQuestion.kapha_option.trim()) {
      toast.error('All three dosha options are required');
      return;
    }

    try {
      if (isAddingNew) {
        // Insert new question
        const { error } = await supabase
          .from('quiz_questions')
          .insert([editingQuestion]);

        if (error) throw error;
        toast.success('Question added successfully');
      } else {
        // Update existing question
        const { error } = await supabase
          .from('quiz_questions')
          .update(editingQuestion)
          .eq('id', editingQuestion.id);

        if (error) throw error;
        toast.success('Question updated successfully');
      }

      setEditingQuestion(null);
      setIsAddingNew(false);
      fetchQuestions();
    } catch (error) {
      console.error('Error saving question:', error);
      toast.error('Failed to save question');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('quiz_questions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Question deleted successfully');
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
    }
  };

  const handleToggleActive = async (question: QuizQuestion) => {
    try {
      const { error } = await supabase
        .from('quiz_questions')
        .update({ is_active: !question.is_active })
        .eq('id', question.id);

      if (error) throw error;
      toast.success(`Question ${question.is_active ? 'deactivated' : 'activated'} successfully`);
      fetchQuestions();
    } catch (error) {
      console.error('Error toggling question status:', error);
      toast.error('Failed to update question status');
    }
  };

  const handleDragStart = (e: React.DragEvent, questionId: string) => {
    setDraggedQuestion(questionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetQuestionId: string) => {
    e.preventDefault();
    if (!draggedQuestion || draggedQuestion === targetQuestionId) return;

    const draggedIndex = questions.findIndex(q => q.id === draggedQuestion);
    const targetIndex = questions.findIndex(q => q.id === targetQuestionId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;

    const newQuestions = [...questions];
    const [draggedItem] = newQuestions.splice(draggedIndex, 1);
    newQuestions.splice(targetIndex, 0, draggedItem);

    // Update order numbers
    const updatedQuestions = newQuestions.map((q, index) => ({
      ...q,
      question_order: index + 1
    }));

    setQuestions(updatedQuestions);

    try {
      // Update all questions with new order
      const updates = updatedQuestions.map(q => ({
        id: q.id,
        question_order: q.question_order
      }));

      const { error } = await supabase
        .from('quiz_questions')
        .upsert(updates, { onConflict: 'id' });

      if (error) throw error;
      toast.success('Question order updated successfully');
    } catch (error) {
      console.error('Error updating question order:', error);
      toast.error('Failed to update question order');
      fetchQuestions(); // Revert to original order
    }

    setDraggedQuestion(null);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dosha Quiz Management</h1>
          <p className="text-gray-600 mt-1">Manage quiz questions and their order</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 flex items-center gap-2"
        >
          <Plus size={16} />
          Add New Question
        </button>
      </div>

      {/* Edit/Add Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {isAddingNew ? 'Add New Question' : 'Edit Question'}
                </h2>
                <button
                  onClick={() => {
                    setEditingQuestion(null);
                    setIsAddingNew(false);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Text *
                  </label>
                  <textarea
                    value={editingQuestion.question}
                    onChange={(e) => setEditingQuestion({...editingQuestion, question: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                    rows={3}
                    placeholder="Enter the question text..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vata Option *
                    </label>
                    <textarea
                      value={editingQuestion.vata_option}
                      onChange={(e) => setEditingQuestion({...editingQuestion, vata_option: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                      rows={4}
                      placeholder="Vata characteristic..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pitta Option *
                    </label>
                    <textarea
                      value={editingQuestion.pitta_option}
                      onChange={(e) => setEditingQuestion({...editingQuestion, pitta_option: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                      rows={4}
                      placeholder="Pitta characteristic..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kapha Option *
                    </label>
                    <textarea
                      value={editingQuestion.kapha_option}
                      onChange={(e) => setEditingQuestion({...editingQuestion, kapha_option: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                      rows={4}
                      placeholder="Kapha characteristic..."
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingQuestion.is_active}
                      onChange={(e) => setEditingQuestion({...editingQuestion, is_active: e.target.checked})}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => {
                      setEditingQuestion(null);
                      setIsAddingNew(false);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center gap-2"
                  >
                    <Save size={16} />
                    {isAddingNew ? 'Add Question' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {questions.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No questions</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new question.</p>
            <div className="mt-6">
              <button
                onClick={handleAddNew}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                Add Question
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {questions.map((question, index) => (
              <div
                key={question.id}
                draggable
                onDragStart={(e) => handleDragStart(e, question.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, question.id)}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  draggedQuestion === question.id ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 pt-1">
                    <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        #{question.question_order}
                      </span>
                      {!question.is_active && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Inactive
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      {question.question}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-600">
                      <div className="p-2 bg-blue-50 rounded">
                        <span className="font-medium text-blue-800">Vata:</span> {question.vata_option}
                      </div>
                      <div className="p-2 bg-orange-50 rounded">
                        <span className="font-medium text-orange-800">Pitta:</span> {question.pitta_option}
                      </div>
                      <div className="p-2 bg-green-50 rounded">
                        <span className="font-medium text-green-800">Kapha:</span> {question.kapha_option}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(question)}
                      className={`p-2 rounded-md ${
                        question.is_active 
                          ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100' 
                          : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                      }`}
                      title={question.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {question.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    
                    <button
                      onClick={() => handleEdit(question)}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(question.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Instructions</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Drag and drop questions to reorder them</li>
          <li>• Use the eye icon to activate/deactivate questions</li>
          <li>• Edit questions by clicking the edit button</li>
          <li>• Inactive questions won't appear in the user quiz</li>
          <li>• All three dosha options are required for each question</li>
        </ul>
      </div>
    </div>
  );
} 