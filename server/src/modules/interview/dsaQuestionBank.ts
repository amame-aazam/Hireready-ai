export interface DSAQuestion {
  id: string;
  title: string;
  difficulty: 'EASY' | 'MEDIUM';
  domain: string;
  prompt: string;
  timeComplexityTarget: string;
  spaceComplexityTarget: string;
  approachKeywords: string[];
  approachExplanationHint: string;
  starterCode: {
    javascript: string;
    python: string;
    java: string;
    cpp: string;
  };
  visibleTestCases: {
    id: string;
    input: string;
    expectedOutput: string;
    isHidden: boolean;
    description: string;
  }[];
  hiddenTestCases: {
    id: string;
    input: string;
    expectedOutput: string;
    isHidden: boolean;
    description: string;
  }[];
}

export const EASY_QUESTIONS: DSAQuestion[] = [
  {
    id: 'two-sum',
    title: 'Two Sum & Optimal Lookup',
    difficulty: 'EASY',
    domain: 'Arrays & Hash Maps',
    prompt:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. Return the answer in any order.',
    timeComplexityTarget: 'O(N)',
    spaceComplexityTarget: 'O(N)',
    approachKeywords: ['hash', 'map', 'dict', 'complement', 'linear', 'hashmap', 'lookup', 'o(n)'],
    approachExplanationHint:
      'A brute force nested loop takes O(N^2) time. Think about how a hash map can remember previously visited elements and their indices for O(1) lookup.',
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Write your solution here
  // Return [index1, index2]
  return [];
}`,
      python: `def two_sum(nums, target):
    # Write your solution here
    # Return [index1, index2]
    return []`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
}`,
      cpp: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        return {};
    }
};`,
    },
    visibleTestCases: [
      {
        id: 'ts-v1',
        input: 'nums = [2, 7, 11, 15], target = 9',
        expectedOutput: '[0, 1]',
        isHidden: false,
        description: 'Standard basic target pair',
      },
      {
        id: 'ts-v2',
        input: 'nums = [3, 2, 4], target = 6',
        expectedOutput: '[1, 2]',
        isHidden: false,
        description: 'Indices not at origin',
      },
      {
        id: 'ts-v3',
        input: 'nums = [3, 3], target = 6',
        expectedOutput: '[0, 1]',
        isHidden: false,
        description: 'Duplicate values in array',
      },
    ],
    hiddenTestCases: [
      {
        id: 'ts-h1',
        input: 'nums = [-1, -2, -3, -4, -5], target = -8',
        expectedOutput: '[2, 4]',
        isHidden: true,
        description: 'Negative elements',
      },
    ],
  },
  {
    id: 'valid-palindrome',
    title: 'Valid Palindrome (Alphanumeric)',
    difficulty: 'EASY',
    domain: 'Strings & Two Pointers',
    prompt:
      'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string s, return true if it is a palindrome, or false otherwise.',
    timeComplexityTarget: 'O(N)',
    spaceComplexityTarget: 'O(1)',
    approachKeywords: ['two pointers', 'pointer', 'reverse', 'left and right', 'two-pointer', 'start and end', 'in-place', 'o(1)'],
    approachExplanationHint:
      'Consider using two pointers initialized at the left and right ends of the string. Skip non-alphanumeric characters and compare lowercase equivalents until they meet in the center.',
    starterCode: {
      javascript: `function isPalindrome(s) {
  // Write your solution here
  // Return boolean true or false
  return false;
}`,
      python: `def is_palindrome(s):
    # Write your solution here
    # Return bool
    return False`,
      java: `class Solution {
    public boolean isPalindrome(String s) {
        // Write your solution here
        return false;
    }
}`,
      cpp: `#include <string>
#include <cctype>
using namespace std;

class Solution {
public:
    bool isPalindrome(string s) {
        // Write your solution here
        return false;
    }
};`,
    },
    visibleTestCases: [
      {
        id: 'vp-v1',
        input: 's = "A man, a plan, a canal: Panama"',
        expectedOutput: 'true',
        isHidden: false,
        description: 'Standard mixed phrase with punctuation',
      },
      {
        id: 'vp-v2',
        input: 's = "race a car"',
        expectedOutput: 'false',
        isHidden: false,
        description: 'Non-palindrome phrase',
      },
      {
        id: 'vp-v3',
        input: 's = " "',
        expectedOutput: 'true',
        isHidden: false,
        description: 'Empty string after removing non-alphanumeric',
      },
    ],
    hiddenTestCases: [
      {
        id: 'vp-h1',
        input: 's = "0P"',
        expectedOutput: 'false',
        isHidden: true,
        description: 'Alphanumeric mismatch',
      },
    ],
  },
  {
    id: 'best-time-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'EASY',
    domain: 'Arrays & Greedy',
    prompt:
      'You are given an array prices where prices[i] is the price of a given stock on the ith day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.',
    timeComplexityTarget: 'O(N)',
    spaceComplexityTarget: 'O(1)',
    approachKeywords: ['greedy', 'min price', 'minimum', 'profit', 'one pass', 'single pass', 'linear', 'o(n)', 'o(1)'],
    approachExplanationHint:
      'Instead of checking every pair with O(N^2), track the minimum buy price seen so far in a single pass while calculating max profit at each step.',
    starterCode: {
      javascript: `function maxProfit(prices) {
  // Write your solution here
  // Return maximum profit number
  return 0;
}`,
      python: `def max_profit(prices):
    # Write your solution here
    # Return int
    return 0`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        // Write your solution here
        return 0;
    }
}`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxProfit(vector<int>& prices) {
        // Write your solution here
        return 0;
    }
};`,
    },
    visibleTestCases: [
      {
        id: 'bs-v1',
        input: 'prices = [7, 1, 5, 3, 6, 4]',
        expectedOutput: '5',
        isHidden: false,
        description: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6)',
      },
      {
        id: 'bs-v2',
        input: 'prices = [7, 6, 4, 3, 1]',
        expectedOutput: '0',
        isHidden: false,
        description: 'Decreasing prices (no profit possible)',
      },
    ],
    hiddenTestCases: [
      {
        id: 'bs-h1',
        input: 'prices = [2, 4, 1]',
        expectedOutput: '2',
        isHidden: true,
        description: 'Valley after peak',
      },
    ],
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'EASY',
    domain: 'Stack & String Parsing',
    prompt:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    timeComplexityTarget: 'O(N)',
    spaceComplexityTarget: 'O(N)',
    approachKeywords: ['stack', 'lifo', 'push', 'pop', 'matching', 'brackets', 'last in first out'],
    approachExplanationHint:
      'A Stack is the ideal data structure here because parentheses must be closed in reverse order of appearance (LIFO). Push open brackets, and on close brackets, pop and verify.',
    starterCode: {
      javascript: `function isValid(s) {
  // Write your solution here
  // Return boolean true or false
  return false;
}`,
      python: `def is_valid(s):
    # Write your solution here
    # Return bool
    return False`,
      java: `import java.util.Stack;

class Solution {
    public boolean isValid(String s) {
        // Write your solution here
        return false;
    }
}`,
      cpp: `#include <string>
#include <stack>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        // Write your solution here
        return false;
    }
};`,
    },
    visibleTestCases: [
      {
        id: 'vp2-v1',
        input: 's = "()[]{}"',
        expectedOutput: 'true',
        isHidden: false,
        description: 'Sequential matching pairs',
      },
      {
        id: 'vp2-v2',
        input: 's = "(]"',
        expectedOutput: 'false',
        isHidden: false,
        description: 'Mismatched closing bracket type',
      },
      {
        id: 'vp2-v3',
        input: 's = "([{}])"',
        expectedOutput: 'true',
        isHidden: false,
        description: 'Nested balanced brackets',
      },
    ],
    hiddenTestCases: [
      {
        id: 'vp2-h1',
        input: 's = "["',
        expectedOutput: 'false',
        isHidden: true,
        description: 'Unclosed single bracket',
      },
    ],
  },
];

export const MEDIUM_QUESTIONS: DSAQuestion[] = [
  {
    id: 'group-anagrams',
    title: 'Group Anagrams',
    difficulty: 'MEDIUM',
    domain: 'Hash Maps & Categorization',
    prompt:
      'Given an array of strings strs, group the anagrams together. You can return the answer in any order.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
    timeComplexityTarget: 'O(N * K log K) or O(N * K)',
    spaceComplexityTarget: 'O(N * K)',
    approachKeywords: ['hash', 'map', 'sort', 'sorted', 'frequency', 'count', 'key', 'hashmap', 'dict'],
    approachExplanationHint:
      'Two strings are anagrams if and only if their sorted characters are identical, or their 26-character frequency counts match. Use that normalized signature as a hash map key.',
    starterCode: {
      javascript: `function groupAnagrams(strs) {
  // Write your solution here
  // Return array of grouped string arrays
  return [];
}`,
      python: `def group_anagrams(strs):
    # Write your solution here
    # Return List[List[str]]
    return []`,
      java: `import java.util.*;

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        // Write your solution here
        return new ArrayList<>();
    }
}`,
      cpp: `#include <vector>
#include <string>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        // Write your solution here
        return {};
    }
};`,
    },
    visibleTestCases: [
      {
        id: 'ga-v1',
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        expectedOutput: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
        isHidden: false,
        description: 'Standard multiple anagram clusters',
      },
      {
        id: 'ga-v2',
        input: 'strs = [""]',
        expectedOutput: '[[""]]',
        isHidden: false,
        description: 'Single empty string',
      },
      {
        id: 'ga-v3',
        input: 'strs = ["a"]',
        expectedOutput: '[["a"]]',
        isHidden: false,
        description: 'Single character string',
      },
    ],
    hiddenTestCases: [
      {
        id: 'ga-h1',
        input: 'strs = ["bdddddddddd","bbbbbbbbbbc"]',
        expectedOutput: '[["bdddddddddd"],["bbbbbbbbbbc"]]',
        isHidden: true,
        description: 'High character frequency collisions',
      },
    ],
  },
  {
    id: 'container-water',
    title: 'Container With Most Water',
    difficulty: 'MEDIUM',
    domain: 'Two Pointers & Greedy',
    prompt:
      'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store. Notice that you may not slant the container.',
    timeComplexityTarget: 'O(N)',
    spaceComplexityTarget: 'O(1)',
    approachKeywords: ['two pointers', 'left and right', 'pointer', 'shorter', 'height', 'greedy', 'area', 'width', 'o(n)'],
    approachExplanationHint:
      'Start with the widest container using two pointers at index 0 and n - 1. Calculate the area, then move the pointer pointing to the shorter vertical line inward.',
    starterCode: {
      javascript: `function maxArea(height) {
  // Write your solution here
  // Return maximum area integer
  return 0;
}`,
      python: `def max_area(height):
    # Write your solution here
    # Return int
    return 0`,
      java: `class Solution {
    public int maxArea(int[] height) {
        // Write your solution here
        return 0;
    }
}`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxArea(vector<int>& height) {
        // Write your solution here
        return 0;
    }
};`,
    },
    visibleTestCases: [
      {
        id: 'cw-v1',
        input: 'height = [1, 8, 6, 2, 5, 4, 8, 3, 7]',
        expectedOutput: '49',
        isHidden: false,
        description: 'Between indices 1 and 8 (min height 7, width 7 -> 49)',
      },
      {
        id: 'cw-v2',
        input: 'height = [1, 1]',
        expectedOutput: '1',
        isHidden: false,
        description: 'Two identical heights at distance 1',
      },
    ],
    hiddenTestCases: [
      {
        id: 'cw-h1',
        input: 'height = [4, 3, 2, 1, 4]',
        expectedOutput: '16',
        isHidden: true,
        description: 'Symmetric outer bounds',
      },
    ],
  },
  {
    id: 'longest-substring',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'MEDIUM',
    domain: 'Sliding Window & Hash Set',
    prompt:
      'Given a string s, find the length of the longest substring without repeating characters.',
    timeComplexityTarget: 'O(N)',
    spaceComplexityTarget: 'O(min(N, M))',
    approachKeywords: ['sliding window', 'window', 'set', 'hash set', 'map', 'two pointers', 'left and right', 'o(n)'],
    approachExplanationHint:
      'Use a sliding window maintained by two pointers (left and right) with a Set or Map tracking characters in the current window. Expand right, and contract left when duplicates occur.',
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {
  // Write your solution here
  // Return length of longest unique substring
  return 0;
}`,
      python: `def length_of_longest_substring(s):
    # Write your solution here
    # Return int
    return 0`,
      java: `import java.util.*;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your solution here
        return 0;
    }
}`,
      cpp: `#include <string>
#include <unordered_set>
#include <algorithm>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        // Write your solution here
        return 0;
    }
};`,
    },
    visibleTestCases: [
      {
        id: 'ls-v1',
        input: 's = "abcabcbb"',
        expectedOutput: '3',
        isHidden: false,
        description: 'The answer is "abc", with length of 3',
      },
      {
        id: 'ls-v2',
        input: 's = "bbbbb"',
        expectedOutput: '1',
        isHidden: false,
        description: 'The answer is "b", with length of 1',
      },
      {
        id: 'ls-v3',
        input: 's = "pwwkew"',
        expectedOutput: '3',
        isHidden: false,
        description: 'The answer is "wke", with length of 3',
      },
    ],
    hiddenTestCases: [
      {
        id: 'ls-h1',
        input: 's = " "',
        expectedOutput: '1',
        isHidden: true,
        description: 'Single whitespace character',
      },
    ],
  },
  {
    id: 'coin-change',
    title: 'Coin Change (Fewest Coins)',
    difficulty: 'MEDIUM',
    domain: 'Dynamic Programming',
    prompt:
      'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.\n\nYou may assume that you have an infinite number of each kind of coin.',
    timeComplexityTarget: 'O(amount * len(coins))',
    spaceComplexityTarget: 'O(amount)',
    approachKeywords: ['dynamic programming', 'dp', 'bottom up', 'memoization', 'table', 'minimum coins', 'bottom-up'],
    approachExplanationHint:
      'This is an unbounded knapsack variation. Create a dp array of size amount + 1 initialized to infinity, with dp[0] = 0. Iterate through each coin to build the minimal combination.',
    starterCode: {
      javascript: `function coinChange(coins, amount) {
  // Write your solution here
  // Return minimum coins needed or -1
  return -1;
}`,
      python: `def coin_change(coins, amount):
    # Write your solution here
    # Return int
    return -1`,
      java: `import java.util.Arrays;

class Solution {
    public int coinChange(int[] coins, int amount) {
        // Write your solution here
        return -1;
    }
}`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        // Write your solution here
        return -1;
    }
};`,
    },
    visibleTestCases: [
      {
        id: 'cc-v1',
        input: 'coins = [1, 2, 5], amount = 11',
        expectedOutput: '3',
        isHidden: false,
        description: '11 = 5 + 5 + 1 (3 coins)',
      },
      {
        id: 'cc-v2',
        input: 'coins = [2], amount = 3',
        expectedOutput: '-1',
        isHidden: false,
        description: 'Cannot form amount 3 with only coin 2',
      },
      {
        id: 'cc-v3',
        input: 'coins = [1], amount = 0',
        expectedOutput: '0',
        isHidden: false,
        description: 'Zero amount requires 0 coins',
      },
    ],
    hiddenTestCases: [
      {
        id: 'cc-h1',
        input: 'coins = [186, 419, 83, 408], amount = 6249',
        expectedOutput: '20',
        isHidden: true,
        description: 'Large amount with complex denominations',
      },
    ],
  },
  {
    id: 'three-sum',
    title: '3Sum (Zero Sum Triplets)',
    difficulty: 'MEDIUM',
    domain: 'Arrays & Two Pointers',
    prompt:
      'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.\n\nNotice that the solution set must not contain duplicate triplets.',
    timeComplexityTarget: 'O(N^2)',
    spaceComplexityTarget: 'O(1) auxiliary',
    approachKeywords: ['sort', 'two pointers', 'two-pointer', 'fix one', 'skip duplicates', 'o(n^2)', 'sorted'],
    approachExplanationHint:
      'Sort the array first. Fix the first element nums[i] in a loop, then use two pointers (left = i + 1, right = n - 1) to find the remaining pair sum equal to -nums[i]. Remember to skip duplicates.',
    starterCode: {
      javascript: `function threeSum(nums) {
  // Write your solution here
  // Return array of unique triplet arrays
  return [];
}`,
      python: `def three_sum(nums):
    # Write your solution here
    # Return List[List[int]]
    return []`,
      java: `import java.util.*;

class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        // Write your solution here
        return new ArrayList<>();
    }
}`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        // Write your solution here
        return {};
    }
};`,
    },
    visibleTestCases: [
      {
        id: '3s-v1',
        input: 'nums = [-1, 0, 1, 2, -1, -4]',
        expectedOutput: '[[-1, -1, 2], [-1, 0, 1]]',
        isHidden: false,
        description: 'Standard multiple distinct triplets',
      },
      {
        id: '3s-v2',
        input: 'nums = [0, 1, 1]',
        expectedOutput: '[]',
        isHidden: false,
        description: 'No triplets sum to zero',
      },
      {
        id: '3s-v3',
        input: 'nums = [0, 0, 0]',
        expectedOutput: '[[0, 0, 0]]',
        isHidden: false,
        description: 'All zeros single triplet',
      },
    ],
    hiddenTestCases: [
      {
        id: '3s-h1',
        input: 'nums = [-2, 0, 0, 2, 2]',
        expectedOutput: '[[-2, 0, 2]]',
        isHidden: true,
        description: 'Duplicate zero values',
      },
    ],
  },
];

/**
 * Randomly select 1 Easy and 2 Medium questions from the bank
 */
export function getRandomDSAQuestions(): DSAQuestion[] {
  // 1 Easy question
  const easyIdx = Math.floor(Math.random() * EASY_QUESTIONS.length);
  const selectedEasy = EASY_QUESTIONS[easyIdx];

  // 2 distinct Medium questions
  const shuffledMedium = [...MEDIUM_QUESTIONS].sort(() => 0.5 - Math.random());
  const selectedMedium1 = shuffledMedium[0];
  const selectedMedium2 = shuffledMedium[1];

  return [selectedEasy, selectedMedium1, selectedMedium2];
}
