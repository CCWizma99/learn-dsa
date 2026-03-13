import { Section, P, BulletList, CodeBlock, Callout, InteractiveConcept } from '../../components/modules/ModuleComponents';
import ModuleFooter from '../../components/modules/ModuleFooter';
import StackViz from '../../components/visualizer/algorithms/StackViz';
import LinkedListStackViz from '../../components/visualizer/algorithms/LinkedListStackViz';
import TowerOfHanoiViz from '../../components/visualizer/algorithms/TowerOfHanoiViz';

export default function StacksModule() {
  return (
    <>
      <Section id="what-are-stacks" title="What are Stacks?">
        <P>
          A **Stack** is a linear data structure that follows a specific order for adding and removing elements: **LIFO (Last-In-First-Out)**.
        </P>
        <P>
          Think of it like a stack of plates. When you add a clean plate, it goes on the **top**. When you take a plate, you take it from the **top**. The last plate placed on the stack is always the first one to be removed.
        </P>
        
        <InteractiveConcept
          title="Array-based Stack Simulation"
          description="Push and Pop elements to see how the 'Top' pointer moves and how LIFO works in a fixed-size array implementation."
        >
          <StackViz />
        </InteractiveConcept>

        <Callout type="info" title="Core Operations">
          <BulletList items={[
            "**Push**: Adds an element to the top of the stack. O(1)",
            "**Pop**: Removes the top element. O(1)",
            "**Peek/Top**: Returns the top element without removing it. O(1)",
            "**isEmpty**: Checks if the stack has no elements. O(1)"
          ]} />
        </Callout>
      </Section>

      <Section id="implementations" title="Implementation Variants">
        <P>
          A stack can be implemented using either a static **Array** or a dynamic **Linked List**. While both provide O(1) operations, they differ in memory management.
        </P>

        <div className="grid grid-cols-1 gap-8 my-8">
          <div className="bg-bg-base/50 p-6 rounded-xl border border-border-color">
            <h4 className="text-accent-primary font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-primary" />
              Linked List Implementation
            </h4>
            <P className="text-sm mb-4">
              In a Linked List stack, each element is a node. New nodes are inserted at the head (Top), ensuring dynamic growth without a fixed MAX size.
            </P>
            <LinkedListStackViz />
          </div>
        </div>

        <CodeBlock
          title="C Implementation Comparison"
          code={`// Array implementation uses an index 'top'
void push_array(int val) {
    stack[++top] = val;
}

// Linked List implementation inserts at the beginning
void push_linked(int val) {
    Node* new = malloc(sizeof(Node));
    new->data = val;
    new->next = top;
    top = new;
}`}
        />
      </Section>

      <Section id="expressions" title="Expression Notations">
        <P>
          Stacks are the backbone of mathematical expression evaluation. Compilers translate standard human-readable expressions into formats that are easier for machines to process.
        </P>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="p-4 bg-bg-surface border border-border-color rounded-lg">
            <span className="text-accent-primary font-bold block mb-1">Infix</span>
            <code className="text-xs">A + B</code>
            <P className="text-[10px] mt-2 text-text-muted">Operator is *between* operands. Standard human notation.</P>
          </div>
          <div className="p-4 bg-bg-surface border border-border-color rounded-lg">
            <span className="text-accent-amber font-bold block mb-1">Postfix (RPN)</span>
            <code className="text-xs">A B +</code>
            <P className="text-[10px] mt-2 text-text-muted">Operator follows operands. Used by calculators and compilers.</P>
          </div>
          <div className="p-4 bg-bg-surface border border-border-color rounded-lg">
            <span className="text-accent-indigo font-bold block mb-1">Prefix (Polish)</span>
            <code className="text-xs">+ A B</code>
            <P className="text-[10px] mt-2 text-text-muted">Operator precedes operands. Used in Lisp-like languages.</P>
          </div>
        </div>

        <Callout type="warning" title="Why Postfix?">
          Postfix expressions (Reverse Polish Notation) do not require parentheses to define order of operations. `(A+B)*C` in infix becomes `A B + C *` in postfix.
        </Callout>
      </Section>

      <Section id="tower-of-hanoi" title="Tower of Hanoi">
        <P>
          The **Tower of Hanoi** is a classic mathematical puzzle that perfectly illustrates the power of **Recursion** and the Stack-like nature of recursive function calls.
        </P>
        <P className="text-sm italic text-text-muted mb-6">
          Rules: Move all disks from source to destination. Only one disk can be moved at a time, and a larger disk can never be placed on top of a smaller one.
        </P>

        <TowerOfHanoiViz />

        <CodeBlock
          title="Recursive Tower of Hanoi (C)"
          code={`void solveHanoi(int n, char src, char aux, char dest) {
    if (n == 1) {
        printf("Move disk 1 from %c to %c\\n", src, dest);
        return;
    }
    // Move n-1 disks to auxiliary
    solveHanoi(n - 1, src, dest, aux);
    
    // Move largest disk to destination
    printf("Move disk %d from %c to %c\\n", n, src, dest);
    
    // Move n-1 disks from auxiliary to destination
    solveHanoi(n - 1, aux, src, dest);
}`}
        />
      </Section>

      <Section id="applications" title="More Stack Applications">
        <BulletList
          items={[
            "**Undo/Redo**: Recent actions are pushed onto a stack. Undo pops the last action.",
            "**Balanced Parentheses**: Ensuring brackets match correctly in code (e.g., '{[()]}').",
            "**Function Calls**: The CPU uses a 'Call Stack' to manage return addresses and local variables.",
            "**Backtracking**: Solving puzzles like mazes where you need to 'go back' to the last decision point."
          ]}
        />
      </Section>

      <ModuleFooter moduleId="stacks" />
    </>
  );
}
