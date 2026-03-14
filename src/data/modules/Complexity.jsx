import { Section, P, BulletList, CodeBlock, Callout, ComparisonTable } from '../../components/modules/ModuleComponents';
import ModuleFooter from '../../components/modules/ModuleFooter';
import { motion } from 'framer-motion';

// Graphical representation of Big O
function BigOGraph() {
  return (
    <div className="bg-bg-elevated border border-border-color rounded-xl p-4 my-6 overflow-hidden">
        <h4 className="text-sm font-medium text-text-primary mb-4 text-center">Complexity Growth Rates</h4>
        <div className="relative h-64 w-full border-l-2 border-b-2 border-border-color/50">
            {/* Y Axis Label */}
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-text-muted tracking-widest uppercase">
                Operations
            </div>
            {/* X Axis Label */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-text-muted tracking-widest uppercase">
                Input Size (n)
            </div>
            
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible p-2">
                {/* O(1) */}
                <motion.path 
                    d="M 0 95 L 100 95" 
                    fill="none" 
                    stroke="var(--accent-green)" 
                    strokeWidth="1.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.2 }}
                />
                
                {/* O(log n) */}
                <motion.path 
                    d="M 0 95 Q 40 85, 100 85" 
                    fill="none" 
                    stroke="var(--accent-primary)" 
                    strokeWidth="1.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.4 }}
                />

                {/* O(n) */}
                <motion.path 
                    d="M 0 95 L 100 20" 
                    fill="none" 
                    stroke="var(--accent-amber)" 
                    strokeWidth="1.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.6 }}
                />

                {/* O(n log n) */}
                <motion.path 
                    d="M 0 95 Q 80 50, 100 0" 
                    fill="none" 
                    stroke="var(--accent-glow)" 
                    strokeWidth="1.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                />

                {/* O(n^2) */}
                <motion.path 
                    d="M 0 95 Q 40 95, 60 0" 
                    fill="none" 
                    stroke="var(--accent-red)" 
                    strokeWidth="1.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 1 }}
                />
            </svg>

            {/* Legend */}
            <div className="absolute top-2 left-4 text-[10px] font-code space-y-1 bg-bg-base/80 p-2 rounded border border-border-color backdrop-blur-sm">
                <div className="flex items-center gap-2"><div className="w-3 h-1 rounded-full" style={{backgroundColor: 'var(--accent-green)'}}/> O(1) Excellent</div>
                <div className="flex items-center gap-2"><div className="w-3 h-1 rounded-full" style={{backgroundColor: 'var(--accent-primary)'}}/> O(log n) Good</div>
                <div className="flex items-center gap-2"><div className="w-3 h-1 rounded-full" style={{backgroundColor: 'var(--accent-amber)'}}/> O(n) Fair</div>
                <div className="flex items-center gap-2"><div className="w-3 h-1 rounded-full" style={{backgroundColor: 'var(--accent-glow)'}}/> O(n log n) Bad</div>
                <div className="flex items-center gap-2"><div className="w-3 h-1 rounded-full" style={{backgroundColor: 'var(--accent-red)'}}/> O(n²) Horrible</div>
            </div>
        </div>
    </div>
  );
}

export default function ComplexityModule() {
  return (
    <>
      <Section id="algorithm-intro" title="Complexity Analysis">
        <P>
          Evaluate the efficiency of algorithms using Big-O Notation.
        </P>
      </Section>

      <Section id="what-is-algorithm" title="What is an Algorithm?">
        <P>
          An **algorithm** is a finite, step-by-step sequence of well-defined instructions that takes some input, processes it, and produces an output to solve a specific problem.
        </P>

        <ComparisonTable 
          headers={['Characteristic', 'Description']}
          rows={[
            ['Finiteness', 'The algorithm must terminate after a finite number of steps'],
            ['Definiteness', 'Each step must be clear and unambiguous'],
            ['Input', 'Zero or more inputs are provided'],
            ['Output', 'At least one output must be produced'],
            ['Effectiveness', 'Each step must be simple enough to execute in finite time']
          ]}
        />
      </Section>

      <Section id="running-time" title="Running Time of a Program">
        <P>
          The **running time** (execution time) of a program is the total time required for a computer to execute the program from start to finish for a given input. Running time usually depends on the **input size (n)**.
        </P>
        <Callout type="info" title="Example">
          Searching a list of 10 items is faster than searching 1000 items.
        </Callout>

        <h4 className="text-lg font-bold text-text-primary mt-8 mb-4">Measuring Running Time</h4>
        <P>
          Instead of measuring actual time in seconds, we count basic operations to make algorithm analysis **machine independent**:
        </P>
        <BulletList plain={true} items={[
          "Comparisons",
          "Assignments",
          "Arithmetic operations"
        ]} />

        <h4 className="text-lg font-bold text-text-primary mt-8 mb-4">Types of Running Time Analysis</h4>
        <ComparisonTable 
          headers={['Type', 'Description']}
          rows={[
            ['Best Case', 'Minimum time required for any input of size n'],
            ['Average Case', 'Expected running time over all inputs'],
            ['Worst Case', 'Maximum time required for any input']
          ]}
        />

        <Callout type="info" title="Example – Linear Search">
          <ComparisonTable 
            headers={['Case', 'Complexity']}
            rows={[
              ['Best Case', 'O(1)'],
              ['Average Case', 'O(n)'],
              ['Worst Case', 'O(n)']
            ]}
          />
        </Callout>
      </Section>

      <Section id="complexity-analysis" title="Complexity Analysis">
        <P>
          Complexity analysis is a technique used to evaluate how the running time and memory usage of an algorithm change as the input size grows. It helps us compare different algorithms and choose the most efficient solution.
        </P>
        <BulletList items={[
          "**Time Complexity**: How long an algorithm takes to compute the result.",
          "**Space Complexity**: How much memory the algorithm requires."
        ]} />

        <h4 className="text-lg font-bold text-text-primary mt-8 mb-4">Running Time vs Time Complexity</h4>
        <ComparisonTable 
          headers={['Running Time', 'Time Complexity']}
          rows={[
            ['Actual execution time of a program', 'Theoretical description of how runtime grows'],
            ['Measured in seconds', 'Expressed using Big-O notation'],
            ['Depends on hardware', 'Machine independent']
          ]}
        />
      </Section>

      <Section id="big-o-notation" title="Big-O Notation">
        <P>
          Big-O notation describes how the running time of an algorithm grows with input size. It focuses on the **growth rate**, not the exact number of operations.
        </P>

        <ComparisonTable 
          headers={['Notation', 'Meaning']}
          rows={[
            ['Big-O (O)', 'Upper bound (worst case)'],
            ['Big-Omega (Ω)', 'Lower bound (best case)'],
            ['Big-Theta (Θ)', 'Tight bound (exact growth rate)']
          ]}
        />

        <BigOGraph />

        <h4 className="text-lg font-bold text-text-primary mt-8 mb-4">Mathematical Definition of Big-O</h4>
        <P>
          A function `f(n)` belongs to `O(g(n))` if there exist positive constants `c` and `n₀` such that:
        </P>
        <div className="bg-bg-elevated p-4 rounded-xl border border-border-color font-code text-center text-accent-primary my-4">
          f(n) ≤ c ⋅ g(n) for all n ≥ n₀
        </div>
        <BulletList plain={true} items={[
          "`f(n)` → actual running time",
          "`g(n)` → simplified growth function",
          "`c` → constant multiplier",
          "`n₀` → threshold value"
        ]} />
      </Section>

      <Section id="dominant-term" title="Dominant Term Rule">
        <P>
          When analyzing time complexity, we only keep the highest-growth term. Lower-order terms and constants are ignored for large inputs.
        </P>
        <Callout type="info" title="Example">
          For `T(n) = 3n² + 5n + 20`, the dominant term is `n²`. Therefore, **T(n) = O(n²)**.
        </Callout>

        <h4 className="text-lg font-bold text-text-primary mt-8 mb-4">Common Time Complexities</h4>
        <ComparisonTable 
          headers={['Complexity', 'Description', 'Example']}
          rows={[
            ['O(1)', 'Constant time', 'Accessing an array element'],
            ['O(log n)', 'Logarithmic', 'Binary Search'],
            ['O(n)', 'Linear', 'Linear Search'],
            ['O(n log n)', 'Linearithmic', 'Merge Sort'],
            ['O(n²)', 'Quadratic', 'Bubble Sort'],
            ['O(2ⁿ)', 'Exponential', 'Recursive Fibonacci'],
            ['O(n!)', 'Factorial', 'Generating permutations']
          ]}
        />
      </Section>

      <Section id="worked-examples" title="Worked Examples">
        <div className="space-y-8">
          <div>
            <h4 className="text-md font-bold text-accent-primary mb-2">Example 1 – Single Loop</h4>
            <CodeBlock 
              code={`for (int i = 0; i < n; i++)
    printf("%d\\n", i);`}
            />
            <P>The loop runs `n` times and each iteration performs constant work. **Time complexity: O(n)**.</P>
          </div>

          <div>
            <h4 className="text-md font-bold text-accent-primary mb-2">Example 2 – Nested Loops</h4>
            <CodeBlock 
              code={`for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++)
        printf("%d %d\\n", i, j);`}
            />
            <P>Outer loop runs `n` times, inner loop runs `n` times. Total operations: `n × n = n²`. **Time complexity: O(n²)**.</P>
          </div>

          <div>
            <h4 className="text-md font-bold text-accent-primary mb-2">Example 3 – Multiple Loops</h4>
            <CodeBlock 
              code={`for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++)
        printf("%d %d\\n", i, j);

for (int k = 0; k < n; k++)
    printf("%d\\n", k);`}
            />
            <P>Nested loops: `O(n²)`. Separate loop: `O(n)`. Total: `O(n²) + O(n)`. Dominant term: **O(n²)**.</P>
          </div>
        </div>
      </Section>

      <Section id="proof-examples" title="Proof Examples for Big-O">
        <div className="space-y-8">
          <div className="bg-bg-surface p-6 rounded-xl border border-border-color">
            <h4 className="text-md font-bold text-text-primary mb-4">Example 4 – Prove that 100n + 5 = O(n)</h4>
            <P>
              Let `f(n) = 100n + 5` and `g(n) = n`. We need constants `c` and `n₀` such that `100n + 5 ≤ c ⋅ n`.
            </P>
            <P>
              Choose: **c = 105, n₀ = 1**. For `n = 1`: `100(1) + 5 = 105 ≤ 105(1)`. 
              Therefore, **100n + 5 ∈ O(n)**.
            </P>
          </div>

          <div className="bg-bg-surface p-6 rounded-xl border border-border-color">
            <h4 className="text-md font-bold text-text-primary mb-4">Example 5 – Prove that 3n³ + 20n² + 5 ∈ O(n³)</h4>
            <P>
              Let `f(n) = 3n³ + 20n² + 5` and `g(n) = n³`.
            </P>
            <P>
              Choose constants: **c = 4, n₀ = 21**. Then `3n³ + 20n² + 5 ≤ 4n³` for all `n ≥ 21`.
              Therefore, **3n³ + 20n² + 5 ∈ O(n³)**.
            </P>
          </div>
        </div>
      </Section>

      <Section id="space-complexity" title="Space Complexity">
        <P>
          Space complexity measures the amount of memory required by an algorithm.
        </P>
        <ComparisonTable 
          headers={['Space Complexity', 'Description']}
          rows={[
            ['O(1)', 'Constant memory usage'],
            ['O(n)', 'Memory grows with input size'],
            ['O(n) Recursive', 'Memory used by recursive call stack']
          ]}
        />
      </Section>

      <Section id="searching-algorithms" title="Searching Algorithms">
        <P>
          Searching algorithms are used to locate an element in a data structure. They answer questions like: Does the element exist? Where is the element located? How many times does it occur?
        </P>

        <h4 className="text-lg font-bold text-text-primary mt-8 mb-4">Linear Search</h4>
        <P>Linear search checks each element sequentially until the target is found.</P>
        <CodeBlock 
          title="Linear Search Pseudocode"
          code={`LinearSearch(arr, target):
    for i from 0 to n-1
        if arr[i] == target
            return i
    return -1`}
        />
        <ComparisonTable 
          headers={['Case', 'Complexity']}
          rows={[
            ['Best Case', 'O(1)'],
            ['Average Case', 'O(n)'],
            ['Worst Case', 'O(n)']
          ]}
        />

        <h4 className="text-lg font-bold text-text-primary mt-8 mb-4">Binary Search</h4>
        <P>Binary search works only on **sorted arrays**. The algorithm repeatedly divides the search space in half.</P>
        <BulletList items={[
          "Find the middle element",
          "Compare with target",
          "Search left or right half"
        ]} />
        <P className="mt-4">
          After k iterations: `n / 2ᵏ = 1`. Solving for k: `k = log₂n`. 
          Final time complexity: **O(log n)**.
        </P>
      </Section>

      <Section id="takeaways" title="Key Takeaways">
        <BulletList items={[
          "Complexity analysis helps evaluate algorithm efficiency.",
          "Big-O notation describes how running time grows with input size.",
          "Only the dominant term matters for large inputs.",
          "Nested loops multiply complexity.",
          "Efficient algorithms scale better for large datasets."
        ]} />
      </Section>

      <ModuleFooter moduleId="complexity" />
    </>
  );
}
