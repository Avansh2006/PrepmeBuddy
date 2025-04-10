import React, { memo, useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import AceEditor from "react-ace"; // Install with: npm install react-ace ace-builds
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

// Constants
const STYLES = {
  hint: "text-yellow-600 bg-yellow-50",
  solution: "text-green-600 bg-green-50",
  buttonBase: "font-medium rounded-md px-3 py-1 transition-all duration-200",
  tag: "inline-block bg-zinc-700 text-gray-200 text-xs px-2 py-1 rounded-full mr-2",
};

// Updated Data with test cases
const QUESTIONS = [
  {
    id: "q1",
    question: "Find the maximum subarray sum.",
    hints: ["Think about tracking maximum values", "Use Kadane's Algorithm"],
    solution: "Keep track of max_so_far and max_ending_here",
    tags: ["array", "dynamic-programming"],
    difficulty: "Medium",
    testCases: [
      { input: [-2, 1, -3, 4, -1, 2, 1, -5, 4], expected: 6 },
      { input: [1], expected: 1 },
      { input: [-1, -2, -3], expected: -1 },
    ],
    referenceSolution: `
      function maxSubArray(arr) {
        let maxSoFar = arr[0];
        let maxEndingHere = arr[0];
        for (let i = 1; i < arr.length; i++) {
          maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);
          maxSoFar = Math.max(maxSoFar, maxEndingHere);
        }
        return maxSoFar;
      }
    `,
  },
  {
    id: "q2",
    question: "Detect cycle in an undirected graph.",
    hints: ["Track visited nodes", "Use DFS with parent tracking"],
    solution: "Use visited array and DFS",
    tags: ["graph", "dfs"],
    difficulty: "Hard",
    testCases: [
      { input: { nodes: 4, edges: [[0, 1], [1, 2], [2, 3], [3, 1]] }, expected: true },
      { input: { nodes: 3, edges: [[0, 1], [1, 2]] }, expected: false },
    ],
    referenceSolution: `
      function hasCycle(nodes, edges) {
        const adj = Array(nodes).fill().map(() => []);
        edges.forEach(([u, v]) => {
          adj[u].push(v);
          adj[v].push(u);
        });
        const visited = new Set();
        function dfs(node, parent) {
          visited.add(node);
          for (let neighbor of adj[node]) {
            if (!visited.has(neighbor)) {
              if (dfs(neighbor, node)) return true;
            } else if (neighbor !== parent) {
              return true;
            }
          }
          return false;
        }
        for (let i = 0; i < nodes; i++) {
          if (!visited.has(i) && dfs(i, -1)) return true;
        }
        return false;
      }
    `,
  },
];

// Question Card Component
const QuestionCard = memo(({
  question,
  showHints,
  showSolution,
  toggleHints,
  toggleSolution,
  isCompleted,
  toggleComplete,
  hasViewedSolution,
  onCodeSubmit,
}) => {
  const [code, setCode] = useState("// Write your solution here");
  const [testResults, setTestResults] = useState(null);

  const handleSubmit = () => {
    try {
      // Warning: Eval is unsafe for production! Use a backend instead.
      const userFunc = new Function(`return ${code}`)();
      const results = question.testCases.map((test, index) => {
        const result = userFunc(test.input);
        return {
          testCase: index + 1,
          passed: result === test.expected,
          input: JSON.stringify(test.input),
          expected: test.expected,
          got: result,
        };
      });
      setTestResults(results);
      onCodeSubmit(question.id, results.every(r => r.passed));
    } catch (error) {
      setTestResults([{ error: `Execution error: ${error.message}` }]);
    }
  };

  return (
    <article
      className={`bg-zinc-800 rounded-xl shadow-lg p-5 mb-6 border ${isCompleted ? 'border-green-500/50' : 'border-zinc-700/50'} transform hover:-translate-y-1 transition-transform duration-300`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-100">{question.question}</h2>
          <div className="mt-2">
            {question.tags.map(tag => (
              <span key={tag} className={STYLES.tag}>{tag}</span>
            ))}
            <span className="text-xs text-gray-400">Difficulty: {question.difficulty}</span>
          </div>
        </div>
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={toggleComplete}
          className="h-5 w-5 text-green-500"
          aria-label="Mark as completed"
        />
      </div>
      <div className="flex gap-4 mb-3">
        <button
          onClick={toggleHints}
          className={`${STYLES.buttonBase} text-blue-400 hover:bg-blue-500/20`}
        >
          {showHints ? "Hide Hints" : "Show Hints"}
        </button>
        <button
          onClick={toggleSolution}
          className={`${STYLES.buttonBase} text-green-400 hover:bg-green-500/20`}
        >
          {showSolution ? "Hide Solution" : "Show Solution"}
        </button>
        <button
          onClick={handleSubmit}
          className={`${STYLES.buttonBase} text-purple-400 hover:bg-purple-500/20`}
        >
          Submit Code
        </button>
      </div>
      <AceEditor
        mode="javascript"
        theme="monokai"
        value={code}
        onChange={setCode}
        name={`editor-${question.id}`}
        editorProps={{ $blockScrolling: true }}
        setOptions={{ useWorker: false }}
        height="200px"
        width="100%"
        className="mb-4 rounded-md"
      />
      {showHints && (
        <section className={`${STYLES.hint} p-3 rounded-md animate-fade-in`}>
          <h3 className="font-medium mb-2">Hints:</h3>
          <ul className="list-disc pl-5 space-y-1">
            {question.hints.map((hint, index) => (
              <li key={index}>{hint}</li>
            ))}
          </ul>
        </section>
      )}
      {showSolution && (
        <p className={`${STYLES.solution} p-2 rounded-md animate-fade-in`}>
          <span className="font-medium">Solution:</span> {question.solution}
          {hasViewedSolution && <span className="text-xs ml-2">(Viewed)</span>}
        </p>
      )}
      {testResults && (
        <div className="mt-4 p-3 bg-zinc-900 rounded-md">
          <h3 className="text-gray-100 font-medium">Test Results:</h3>
          {testResults.map((result, index) => (
            <p key={index} className={result.passed ? "text-green-400" : "text-red-400"}>
              {result.error || 
                `Test ${result.testCase}: ${result.passed ? "Passed" : 
                  `Failed - Expected ${result.expected}, Got ${result.got}`}`}
            </p>
          ))}
        </div>
      )}
    </article>
  );
});

// Main Component
const PracticeQuestions = () => {
  const [visibility, setVisibility] = useState({});
  const [completed, setCompleted] = useState({});
  const [solutionViewed, setSolutionViewed] = useState({});

  const toggleVisibility = useCallback((id, type) => {
    setVisibility((prev) => ({
      ...prev,
      [id]: { ...prev[id], [type]: !prev[id]?.[type] },
    }));
    if (type === "solution" && !visibility[id]?.solution) {
      setSolutionViewed((prev) => ({ ...prev, [id]: true }));
    }
  }, []);

  const toggleComplete = useCallback((id) => {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleCodeSubmit = useCallback((id, allTestsPassed) => {
    if (allTestsPassed) {
      setCompleted((prev) => ({ ...prev, [id]: true }));
    }
  }, []);

  const questionItems = useMemo(
    () =>
      QUESTIONS.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          showHints={visibility[question.id]?.hints || false}
          showSolution={visibility[question.id]?.solution || false}
          toggleHints={() => toggleVisibility(question.id, "hints")}
          toggleSolution={() => toggleVisibility(question.id, "solution")}
          isCompleted={completed[question.id] || false}
          toggleComplete={() => toggleComplete(question.id)}
          hasViewedSolution={solutionViewed[question.id] || false}
          onCodeSubmit={handleCodeSubmit}
        />
      )),
    [visibility, toggleVisibility, completed, toggleComplete, solutionViewed, handleCodeSubmit]
  );

  const stats = useMemo(() => ({
    completed: Object.values(completed).filter(Boolean).length,
    total: QUESTIONS.length,
    solutionsViewed: Object.values(solutionViewed).filter(Boolean).length,
  }), [completed, solutionViewed]);

  return (
    <section className="p-6 max-w-4xl mx-auto bg-gradient-to-b from-zinc-900 to-zinc-800 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-100 tracking-tight bg-gradient-to-r from-gray-100 to-zinc-400 bg-clip-text text-transparent">
          Practice Questions
        </h1>
        <div className="mt-2 text-gray-400 text-sm space-y-1">
          <p>Completed: {stats.completed} / {stats.total}</p>
          <p>Solutions Viewed: {stats.solutionsViewed} / {stats.total}</p>
        </div>
      </header>
      <div className="space-y-6">{questionItems}</div>
    </section>
  );
};

// PropTypes
QuestionCard.propTypes = {
  question: PropTypes.shape({
    id: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    hints: PropTypes.arrayOf(PropTypes.string).isRequired,
    solution: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    difficulty: PropTypes.string.isRequired,
    testCases: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  showHints: PropTypes.bool.isRequired,
  showSolution: PropTypes.bool.isRequired,
  toggleHints: PropTypes.func.isRequired,
  toggleSolution: PropTypes.func.isRequired,
  isCompleted: PropTypes.bool.isRequired,
  toggleComplete: PropTypes.func.isRequired,
  hasViewedSolution: PropTypes.bool.isRequired,
  onCodeSubmit: PropTypes.func.isRequired,
};

QuestionCard.displayName = "QuestionCard";
PracticeQuestions.displayName = "PracticeQuestions";
export default memo(PracticeQuestions);