import React from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export default function TestSupabase() {
  const supabase = useSupabaseClient();
  const [testResults, setTestResults] = React.useState<string[]>([]);

  React.useEffect(() => {
    async function testConnection() {
      const results: string[] = [];
      
      // Test appointments table
      try {
        const { data: appointments, error: appointmentsError } = await supabase
          .from('appointments')
          .select('*')
          .limit(1);
        
        if (appointmentsError) throw appointmentsError;
        results.push('✅ Appointments table connection successful');
      } catch (error) {
        results.push('❌ Appointments table connection failed: ' + (error as Error).message);
      }

      // Test quiz_questions table
      try {
        const { data: questions, error: questionsError } = await supabase
          .from('quiz_questions')
          .select('*')
          .limit(1);
        
        if (questionsError) throw questionsError;
        results.push('✅ Quiz questions table connection successful');
      } catch (error) {
        results.push('❌ Quiz questions table connection failed: ' + (error as Error).message);
      }

      // Test products table
      try {
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .limit(1);
        
        if (productsError) throw productsError;
        results.push('✅ Products table connection successful');
      } catch (error) {
        results.push('❌ Products table connection failed: ' + (error as Error).message);
      }

      setTestResults(results);
    }

    testConnection();
  }, [supabase]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Supabase Connection Test</h2>
      <div className="space-y-2">
        {testResults.map((result, index) => (
          <div key={index} className="text-sm">
            {result}
          </div>
        ))}
      </div>
    </div>
  );
} 