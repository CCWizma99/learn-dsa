import { Section, P, BulletList, CodeBlock, Callout, InteractiveConcept } from '../../components/modules/ModuleComponents';
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
      <Section id="complexity-intro" title="Complexity Analysis">
        <P>
          In computer science, solving a problem isn't just about finding *a* solution; it's about finding an *efficient* solution. As the size of your data grows from ten items to ten million items, the resources your algorithm consumes matter immensely.
        </P>
        <P>
          We measure efficiency across two primary dimensions:
        </P>
        <BulletList
            items={[
                "Space Complexity: How much extra memory (RAM) does the algorithm need as the input size grows?",
                "Time Complexity: How many operations does the algorithm execute as the input size grows? (This translates to runtime speed)",
            ]}
        />
        
        <Callout type="warning" title="A Common Misconception">
            Time complexity does NOT measure the actual physical time (in seconds or milliseconds) an algorithm takes to run. Hardware speeds, background processes, and language overhead vary wildly. Instead, we measure the **number of operations** relative to the **size of the input**.
        </Callout>
      </Section>

      <Section id="big-o" title="Big-O Notation">
        <P>
          In computer science, we use three primary asymptotic notations to describe the growth of an algorithm:
        </P>

        <BulletList
          items={[
            "Big-O Notation (O): Represents the Upper Bound. It tells us the worst-case scenario (the maximum operations).",
            "Big-Omega Notation (Ω): Represents the Lower Bound. It tells us the best-case scenario (the minimum operations).",
            "Big-Theta Notation (Θ): Represents the Tight Bound. An algorithm is Θ(n) if it is both O(n) and Ω(n). This is the 'average' or 'exact' case.",
          ]}
        />

        <BigOGraph />

        <P>
            When calculating Big-O, we focus on the most dominant term and drop all constants. If an algorithm takes <code className="text-accent-glow font-code">2n² + 5n + 10</code> operations, we say it is <code className="text-accent-glow font-code">O(n²)</code>. The <code className="text-accent-glow font-code">n²</code> term grows so much faster than <code className="text-accent-glow font-code">n</code> that the other terms become mathematically insignificant at scale.
        </P>
      </Section>

      <Section id="examples" title="Common Complexities in Practice">
        
        <InteractiveConcept 
          title="O(1) - Constant Time"
          description="The algorithm takes the same number of operations regardless of the input size."
        >
          <CodeBlock
            title="O(1) Example (C)"
            code={`int getFirstElement(int arr[], int size) {
    // It takes one step, whether the array has 5 items or 5 billion.
    return arr[0];
}`}
          />
        </InteractiveConcept>

        <InteractiveConcept 
          title="O(n) - Linear Time"
          description="The number of operations grows linearly in direct proportion to the input size."
        >
          <CodeBlock
            title="O(n) Example (C)"
            code={`void printAllElements(int arr[], int n) {
    // We must execute the loop 'n' times
    for (int i = 0; i < n; i++) {
        printf("%d\\n", arr[i]);
    }
}`}
          />
        </InteractiveConcept>

        <InteractiveConcept 
          title="O(n²) - Quadratic Time"
          description="The number of operations is the square of the input size. Common in nested iterations."
        >
          <CodeBlock
            title="O(n²) Example (C)"
            code={`void printAllPairs(int arr[], int n) {
    // For every 'n' element, we loop 'n' times. n * n = n²
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            printf("%d, %d\\n", arr[i], arr[j]);
        }
    }
}`}
          />
        </InteractiveConcept>
        
        <Callout type="info" title="The Elusive O(log n)">
            If you see an algorithm that halves the problem space with every step (like finding a word in a dictionary by continually splitting it open to the middle), its complexity is **Logarithmic O(log n)**. This is extremely efficient!
        </Callout>
      </Section>

      <Section id="space-complexity" title="A Note on Space Complexity">
        <P>
            Space complexity follows the exact same Big-O rules, but measures memory allocation. 
        </P>
        <BulletList
            items={[
                "O(1) Space: Modifying an array in place without creating new arrays.",
                "O(n) Space: Creating a copy of the array or pushing elements to a new list.",
                "O(n) Space (Recursive): Deep recursive functions consume call stack memory proportional to their depth.",
            ]}
        />
      </Section>

      <ModuleFooter moduleId="complexity" />
    </>
  );
}
