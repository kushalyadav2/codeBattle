import axios from 'axios';

const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;

// Language mappings for Judge0
const LANGUAGE_IDS = {
  javascript: 63, // Node.js
  python: 71,     // Python 3
  cpp: 54,        // C++ (GCC 9.2.0)
  java: 62,       // Java (OpenJDK 13.0.1)
  c: 50,          // C (GCC 9.2.0)
  csharp: 51,     // C# (Mono 6.6.0.161)
  go: 60,         // Go (1.13.5)
  rust: 73,       // Rust (1.40.0)
  php: 68,        // PHP (7.4.1)
  ruby: 72        // Ruby (2.7.0)
};

class CodeExecutor {
  constructor() {
    this.apiHeaders = {
      'Content-Type': 'application/json',
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      'X-RapidAPI-Key': JUDGE0_API_KEY
    };
  }

  async executeCode(submission) {
    try {
      const { code, language, input = '', expectedOutput } = submission;
      const languageId = LANGUAGE_IDS[language];

      if (!languageId) {
        throw new Error(`Unsupported language: ${language}`);
      }

      // Submit code for execution
      const submissionResponse = await axios.post(
        `${JUDGE0_API_URL}/submissions`,
        {
          source_code: Buffer.from(code).toString('base64'),
          language_id: languageId,
          stdin: Buffer.from(input).toString('base64'),
          expected_output: expectedOutput ? Buffer.from(expectedOutput).toString('base64') : null
        },
        { headers: this.apiHeaders }
      );

      const token = submissionResponse.data.token;

      // Poll for result
      const result = await this.pollForResult(token);
      return this.formatResult(result);
    } catch (error) {
      console.error('Code execution error:', error);
      throw new Error('Failed to execute code');
    }
  }

  async pollForResult(token, maxAttempts = 10) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await axios.get(
          `${JUDGE0_API_URL}/submissions/${token}`,
          { headers: this.apiHeaders }
        );

        const result = response.data;
        
        // Check if execution is complete
        if (result.status.id <= 2) {
          // Still processing (In Queue = 1, Processing = 2)
          await this.sleep(1000); // Wait 1 second
          continue;
        }

        return result;
      } catch (error) {
        console.error(`Polling attempt ${attempt + 1} failed:`, error);
        if (attempt === maxAttempts - 1) {
          throw error;
        }
        await this.sleep(1000);
      }
    }

    throw new Error('Execution timeout');
  }

  formatResult(result) {
    const status = result.status;
    const stdout = result.stdout ? Buffer.from(result.stdout, 'base64').toString() : '';
    const stderr = result.stderr ? Buffer.from(result.stderr, 'base64').toString() : '';
    const compileOutput = result.compile_output ? Buffer.from(result.compile_output, 'base64').toString() : '';

    return {
      status: {
        id: status.id,
        description: status.description
      },
      stdout: stdout.trim(),
      stderr: stderr.trim(),
      compileOutput: compileOutput.trim(),
      time: result.time,
      memory: result.memory,
      exitCode: result.exit_code,
      isSuccess: status.id === 3, // Accepted
      isCompileError: status.id === 6, // Compilation Error
      isRuntimeError: status.id === 5, // Runtime Error
      isTimeLimit: status.id === 4, // Time Limit Exceeded
      isWrongAnswer: status.id === 4 // Wrong Answer
    };
  }

  async runTestCases(code, language, testCases) {
    const results = [];
    
    for (const testCase of testCases) {
      try {
        const result = await this.executeCode({
          code,
          language,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput
        });

        const passed = result.isSuccess && 
                      result.stdout.trim() === testCase.expectedOutput.trim();

        results.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: result.stdout,
          passed,
          executionTime: result.time,
          memory: result.memory,
          error: result.stderr || result.compileOutput,
          status: result.status
        });
      } catch (error) {
        results.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: '',
          passed: false,
          error: error.message,
          status: { description: 'Execution Error' }
        });
      }
    }

    return {
      results,
      totalTests: testCases.length,
      passedTests: results.filter(r => r.passed).length,
      allPassed: results.every(r => r.passed)
    };
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Fallback local execution for development (limited languages)
class LocalCodeExecutor {
  async executeCode(submission) {
    const { code, language, input = '' } = submission;
    
    // This is a simplified local executor for development
    // In production, you should use Judge0 or a proper sandboxed environment
    
    if (language === 'javascript') {
      return this.executeJavaScript(code, input);
    }
    
    throw new Error(`Local execution not supported for ${language}`);
  }

  async executeJavaScript(code, input) {
    try {
      // Create a safe execution context
      const wrappedCode = `
        const console = {
          log: (...args) => output.push(args.join(' '))
        };
        const output = [];
        const input = ${JSON.stringify(input)};
        
        ${code}
        
        return output.join('\\n');
      `;

      const result = new Function(wrappedCode)();
      
      return {
        status: { id: 3, description: 'Accepted' },
        stdout: result,
        stderr: '',
        time: 0.1,
        memory: 1024,
        isSuccess: true
      };
    } catch (error) {
      return {
        status: { id: 5, description: 'Runtime Error' },
        stdout: '',
        stderr: error.message,
        time: 0,
        memory: 0,
        isSuccess: false,
        isRuntimeError: true
      };
    }
  }

  async runTestCases(code, language, testCases) {
    const results = [];
    
    for (const testCase of testCases) {
      const result = await this.executeCode({
        code,
        language,
        input: testCase.input
      });

      const passed = result.isSuccess && 
                    result.stdout.trim() === testCase.expectedOutput.trim();

      results.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: result.stdout,
        passed,
        executionTime: result.time,
        memory: result.memory,
        error: result.stderr,
        status: result.status
      });
    }

    return {
      results,
      totalTests: testCases.length,
      passedTests: results.filter(r => r.passed).length,
      allPassed: results.every(r => r.passed)
    };
  }
}

// Export the appropriate executor based on configuration
const codeExecutor = JUDGE0_API_KEY ? new CodeExecutor() : new LocalCodeExecutor();

export default codeExecutor;
