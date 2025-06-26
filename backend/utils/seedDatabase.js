import mongoose from 'mongoose';
import Problem from '../models/Problem.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleProblems = [
  {
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    difficulty: "Easy",
    category: "Array",
    tags: ["array", "hash-table"],
    constraints: `• 2 <= nums.length <= 10^4
• -10^9 <= nums[i] <= 10^9
• -10^9 <= target <= 10^9
• Only one valid answer exists.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
      }
    ],
    testCases: [
      { input: "[2,7,11,15]\n9", expectedOutput: "[0,1]", isHidden: false },
      { input: "[3,2,4]\n6", expectedOutput: "[1,2]", isHidden: false },
      { input: "[3,3]\n6", expectedOutput: "[0,1]", isHidden: true },
      { input: "[1,2,3,4,5]\n8", expectedOutput: "[2,4]", isHidden: true }
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
    // Your code here
    
}`,
      python: `def two_sum(nums, target):
    # Your code here
    pass`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
        
    }
};`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        
    }
}`
    },
    editorial: {
      solution: `function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}`,
      explanation: "Use a hash map to store numbers and their indices. For each number, check if its complement exists in the map.",
      complexity: {
        time: "O(n)",
        space: "O(n)"
      }
    }
  },
  {
    title: "Reverse String",
    description: `Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.`,
    difficulty: "Easy",
    category: "String",
    tags: ["string", "two-pointers"],
    constraints: `• 1 <= s.length <= 10^5
• s[i] is a printable ascii character.`,
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
        explanation: "The string is reversed in-place."
      }
    ],
    testCases: [
      { input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]', isHidden: false },
      { input: '["H","a","n","n","a","h"]', expectedOutput: '["h","a","n","n","a","H"]', isHidden: false },
      { input: '["a"]', expectedOutput: '["a"]', isHidden: true }
    ],
    starterCode: {
      javascript: `function reverseString(s) {
    // Your code here
    
}`,
      python: `def reverse_string(s):
    # Your code here
    pass`,
      cpp: `class Solution {
public:
    void reverseString(vector<char>& s) {
        // Your code here
        
    }
};`,
      java: `class Solution {
    public void reverseString(char[] s) {
        // Your code here
        
    }
}`
    }
  },
  {
    title: "Valid Parentheses",
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    difficulty: "Medium",
    category: "String",
    tags: ["string", "stack"],
    constraints: `• 1 <= s.length <= 10^4
• s consists of parentheses only '()[]{}'.`,
    examples: [
      {
        input: 's = "()"',
        output: 'true',
        explanation: "The string contains valid parentheses."
      },
      {
        input: 's = "()[]{}"',
        output: 'true',
        explanation: "All brackets are properly matched."
      },
      {
        input: 's = "(]"',
        output: 'false',
        explanation: "Brackets are not properly matched."
      }
    ],
    testCases: [
      { input: '"()"', expectedOutput: 'true', isHidden: false },
      { input: '"()[]{}"', expectedOutput: 'true', isHidden: false },
      { input: '"(]"', expectedOutput: 'false', isHidden: false },
      { input: '"([)]"', expectedOutput: 'false', isHidden: true },
      { input: '"{[]}"', expectedOutput: 'true', isHidden: true }
    ],
    starterCode: {
      javascript: `function isValid(s) {
    // Your code here
    
}`,
      python: `def is_valid(s):
    # Your code here
    pass`,
      cpp: `class Solution {
public:
    bool isValid(string s) {
        // Your code here
        
    }
};`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Your code here
        
    }
}`
    }
  },
  {
    title: "Binary Tree Maximum Depth",
    description: `Given the root of a binary tree, return its maximum depth.

A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.`,
    difficulty: "Hard",
    category: "Tree",
    tags: ["tree", "depth-first-search", "breadth-first-search", "binary-tree"],
    constraints: `• The number of nodes in the tree is in the range [0, 10^4].
• -100 <= Node.val <= 100`,
    examples: [
      {
        input: 'root = [3,9,20,null,null,15,7]',
        output: '3',
        explanation: "The maximum depth is 3."
      }
    ],
    testCases: [
      { input: '[3,9,20,null,null,15,7]', expectedOutput: '3', isHidden: false },
      { input: '[1,null,2]', expectedOutput: '2', isHidden: false },
      { input: '[]', expectedOutput: '0', isHidden: true }
    ],
    starterCode: {
      javascript: `function maxDepth(root) {
    // Your code here
    
}`,
      python: `def max_depth(root):
    # Your code here
    pass`,
      cpp: `class Solution {
public:
    int maxDepth(TreeNode* root) {
        // Your code here
        
    }
};`,
      java: `class Solution {
    public int maxDepth(TreeNode root) {
        // Your code here
        
    }
}`
    }
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codebattle');
    console.log('Connected to MongoDB');

    // Clear existing problems
    await Problem.deleteMany({});
    console.log('Cleared existing problems');

    // Insert sample problems
    const insertedProblems = await Problem.insertMany(sampleProblems);
    console.log(`Inserted ${insertedProblems.length} sample problems`);

    // Create a sample admin user if it doesn't exist
    const adminUser = await User.findOne({ email: 'admin@codebattle.com' });
    if (!adminUser) {
      const admin = new User({
        username: 'admin',
        email: 'admin@codebattle.com',
        password: 'admin123',
        level: 'Platinum',
        totalPoints: 10000,
        gamesPlayed: 50,
        gamesWon: 35,
        currentStreak: 5,
        maxStreak: 12
      });
      await admin.save();
      console.log('Created admin user: admin@codebattle.com / admin123');
    }

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export default seedDatabase;
