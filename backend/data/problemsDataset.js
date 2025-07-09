// CodeBattle Problems Dataset
// Complete problem data according to Problem.js schema

export const problemsDataset = [
  // EASY PROBLEMS
  {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "Easy",
    category: "Array",
    tags: ["array", "hash-table"],
    constraints: "2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] = 2 + 7 = 9, we return [0, 1]."
      }
    ],
    testCases: [
      { input: "[2,7,11,15]\n9", expectedOutput: "[0,1]", isHidden: false },
      { input: "[3,2,4]\n6", expectedOutput: "[1,2]", isHidden: false },
      { input: "[3,3]\n6", expectedOutput: "[0,1]", isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    starterCode: {
      javascript: "function twoSum(nums, target) {\n    // Your code here\n}",
      python: "def two_sum(nums, target):\n    # Your code here\n    pass"
    },
    editorial: {
      solution: "function twoSum(nums, target) { const map = new Map(); for (let i = 0; i < nums.length; i++) { const complement = target - nums[i]; if (map.has(complement)) { return [map.get(complement), i]; } map.set(nums[i], i); } return []; }",
      explanation: "Use a hash map to store numbers and their indices.",
      complexity: {
        time: "O(n)",
        space: "O(n)"
      }
    }
  },

  {
    title: "Palindrome Number",
    description: "Given an integer x, return true if x is a palindrome, and false otherwise.",
    difficulty: "Easy",
    category: "Math",
    tags: ["math"],
    constraints: "-2^31 <= x <= 2^31 - 1",
    examples: [
      {
        input: "x = 121",
        output: "true",
        explanation: "121 reads as 121 from left to right and from right to left."
      }
    ],
    testCases: [
      { input: "121", expectedOutput: "true", isHidden: false },
      { input: "-121", expectedOutput: "false", isHidden: false },
      { input: "10", expectedOutput: "false", isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 64,
    starterCode: {
      javascript: "function isPalindrome(x) {\n    // Your code here\n}",
      python: "def is_palindrome(x):\n    # Your code here\n    pass"
    }
  },

  {
    title: "Valid Parentheses",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    difficulty: "Easy",
    category: "String",
    tags: ["string", "stack"],
    constraints: "1 <= s.length <= 10^4, s consists of parentheses only '()[]{}'.",
    examples: [
      {
        input: 's = "()"',
        output: "true",
        explanation: "The string contains valid parentheses."
      }
    ],
    testCases: [
      { input: "()", expectedOutput: "true", isHidden: false },
      { input: "()[]{}", expectedOutput: "true", isHidden: false },
      { input: "(]", expectedOutput: "false", isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    starterCode: {
      javascript: "function isValid(s) {\n    // Your code here\n}",
      python: "def is_valid(s):\n    # Your code here\n    pass"
    }
  },

  {
    title: "Maximum Subarray",
    description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
    difficulty: "Medium",
    category: "Dynamic Programming",
    tags: ["array", "dynamic-programming"],
    constraints: "1 <= nums.length <= 10^5, -10^4 <= nums[i] <= 10^4",
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum 6."
      }
    ],
    testCases: [
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", expectedOutput: "6", isHidden: false },
      { input: "[1]", expectedOutput: "1", isHidden: false },
      { input: "[5,4,-1,7,8]", expectedOutput: "23", isHidden: true }
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    starterCode: {
      javascript: "function maxSubArray(nums) {\n    // Your code here\n}",
      python: "def max_sub_array(nums):\n    # Your code here\n    pass"
    }
  }
];

// Helper function to seed database
export const seedProblems = async (Problem) => {
  try {
    // Clear existing problems
    await Problem.deleteMany({});
    
    // Insert new problems
    const problems = await Problem.insertMany(problemsDataset);
    console.log(`✅ Seeded ${problems.length} problems successfully!`);
    
    return problems;
  } catch (error) {
    console.error('❌ Error seeding problems:', error);
    throw error;
  }
};
