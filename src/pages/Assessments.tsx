import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

type BodyPart = 'face' | 'tongue' | 'eyes' | 'nose' | 'ears' | 'teeth' | 'general face';

const Assessments = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart>('face');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);
    if (!user) {
      setError('Please log in to use the assessment feature');
    }
  };

  const bodyParts: { value: BodyPart; label: string; description: string }[] = [
    { value: 'face', label: 'Face', description: 'Overall facial features and complexion' },
    { value: 'tongue', label: 'Tongue', description: 'Tongue color, coating, and texture' },
    { value: 'eyes', label: 'Eyes', description: 'Eye color, shape, and surrounding area' },
    { value: 'nose', label: 'Nose', description: 'Nose shape, color, and texture' },
    { value: 'ears', label: 'Ears', description: 'Ear shape, color, and texture' },
    { value: 'teeth', label: 'Teeth', description: 'Teeth color, alignment, and gum health' },
    { value: 'general face', label: 'General Face', description: 'Overall facial analysis' }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getPromptForBodyPart = (bodyPart: BodyPart): string => {
    const prompts = {
      face: "Analyze this person's face and provide a detailed Ayurvedic assessment. Focus on facial features, skin texture, complexion, and any visible imbalances. Consider the three doshas (Vata, Pitta, Kapha) and their manifestations in facial characteristics. Be specific about any potential health concerns or imbalances you observe.",
      tongue: "Analyze this person's tongue and provide a detailed Ayurvedic assessment. Focus on tongue color, coating, texture, and any visible patterns or marks. Consider what these characteristics might indicate about digestive health, dosha imbalances, and potential health concerns. Be specific and professional in your analysis.",
      eyes: "Analyze this person's eyes and provide a detailed Ayurvedic assessment. Focus on eye color, shape, surrounding area, and any visible characteristics. Consider what these features might indicate about dosha balance, overall health, and potential imbalances. Be specific and professional in your analysis.",
      nose: "Analyze this person's nose and provide a detailed Ayurvedic assessment. Focus on nose shape, color, texture, and any visible characteristics. Consider what these features might indicate about respiratory health, dosha balance, and potential imbalances. Be specific and professional in your analysis.",
      ears: "Analyze this person's ears and provide a detailed Ayurvedic assessment. Focus on ear shape, color, texture, and any visible characteristics. Consider what these features might indicate about kidney health, dosha balance, and potential imbalances. Be specific and professional in your analysis.",
      teeth: "Analyze this person's teeth and gums and provide a detailed Ayurvedic assessment. Focus on tooth color, alignment, gum health, and any visible characteristics. Consider what these features might indicate about digestive health, dosha balance, and potential imbalances. Be specific and professional in your analysis.",
      'general face': "Provide a comprehensive Ayurvedic assessment of this person's face. Consider all facial features, skin condition, and overall appearance. Analyze the balance of the three doshas (Vata, Pitta, Kapha) and their manifestations. Identify any potential health concerns or imbalances. Be specific and professional in your analysis."
    };
    return prompts[bodyPart];
  };

  const saveAnalysisToSupabase = async (imageUrl: string, analysis: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('ayurvedic_assessments')
        .insert([
          {
            user_id: user.id,
            body_part: selectedBodyPart,
            image_url: imageUrl,
            analysis: analysis,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;
    } catch (err) {
      console.error('Error saving analysis:', err);
      // Don't throw the error as we still want to show the analysis to the user
    }
  };

  const analyzeImage = async () => {
    if (!isAuthenticated) {
      setError('Please log in to use the assessment feature');
      navigate('/login');
      return;
    }

    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      // First, upload the image to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('assessments')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('Failed to upload image. Please try again.');
      }

      // Get the public URL of the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('assessments')
        .getPublicUrl(fileName);

      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        const base64Data = base64Image.split(',')[1];

        // Call DeepSeek API
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer sk-63924e0ff8c64287b175310c10bd8c42`
          },
          body: JSON.stringify({
            model: "deepseek-vision",
            messages: [
              {
                role: "system",
                content: "You are an Ayurvedic expert. Analyze the image and provide a detailed assessment based on Ayurvedic principles."
              },
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: getPromptForBodyPart(selectedBodyPart)
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: `data:${selectedFile.type};base64,${base64Data}`
                    }
                  }
                ]
              }
            ],
            temperature: 0.4,
            max_tokens: 2048
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(`API Error: ${errorData.error?.message || 'Failed to analyze image'}`);
        }

        const data = await response.json();
        console.log('API Response:', data); // Debug log

        if (data.choices && data.choices[0].message.content) {
          const analysisText = data.choices[0].message.content;
          setAnalysis(analysisText);
          // Save the analysis to Supabase
          await saveAnalysisToSupabase(publicUrl, analysisText);
        } else {
          console.error('Unexpected API Response:', data); // Debug log
          throw new Error('No analysis received from DeepSeek');
        }
      };
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Ayurvedic Assessment</h1>
          <p className="text-lg text-gray-600 mb-8">
            Please log in to use the assessment feature.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Ayurvedic Assessment</h1>
          <p className="text-lg text-gray-600 mb-8">
            Upload a clear photo and select the body part for an Ayurvedic analysis using AI technology.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="space-y-6">
            {/* Body Part Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Body Part
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bodyParts.map((part) => (
                  <button
                    key={part.value}
                    onClick={() => setSelectedBodyPart(part.value)}
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${
                      selectedBodyPart === part.value
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <h3 className="font-medium text-gray-900">{part.label}</h3>
                    <p className="text-sm text-gray-500">{part.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Photo
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {preview ? (
                    <div className="mb-4">
                      <img
                        src={preview}
                        alt="Preview"
                        className="mx-auto h-64 w-64 object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileSelect}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={analyzeImage}
                disabled={!selectedFile || loading}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                  !selectedFile || loading
                    ? 'bg-indigo-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                }`}
              >
                {loading ? 'Analyzing...' : 'Analyze Photo'}
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Analyzing your image...</p>
          </div>
        )}

        {analysis && (
          <div className="bg-white shadow rounded-lg p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis Results</h2>
            <div className="prose max-w-none">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 whitespace-pre-line">{analysis}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assessments; 