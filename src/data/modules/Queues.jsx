import { Section, P, BulletList, CodeBlock, Callout, InteractiveConcept } from '../../components/modules/ModuleComponents';
import ModuleFooter from '../../components/modules/ModuleFooter';
import QueueViz from '../../components/visualizer/algorithms/QueueViz';
import CircularQueueViz from '../../components/visualizer/algorithms/CircularQueueViz';
import PriorityQueueViz from '../../components/visualizer/algorithms/PriorityQueueViz';
import LinkedListQueueViz from '../../components/visualizer/algorithms/LinkedListQueueViz';

export default function QueuesModule() {
  return (
    <>
      <Section id="introduction" title="Introduction to Queues">
        <P>
          A **Queue** is a restricted, linear data structure that operates on a **FIFO (First-In, First-Out)** basis. In a queue, elements are stored in the order of their insertion.
        </P>
        <P>
          Imagine an escalator: the first person to step on is the first person to step off at the top.
        </P>
        
        <InteractiveConcept
          title="Basic Queue (Array-based)"
          description="Elements are inserted at the Rear and removed from the Front. Notice the pointers shifting."
        >
          <QueueViz />
        </InteractiveConcept>

        <Callout type="info" title="Key Components">
          <BulletList plain={true} items={[
            "**Front**: A pointer referring to the first position (deletion point).",
            "**Rear (Back)**: A pointer referring to the last position (insertion point).",
            "**MaxQueue (Size)**: The maximum number of elements the queue can hold.",
            "**Initialization**: For an empty queue, typical initial values are `Front = -1` and `Rear = -1`."
          ]} />
        </Callout>
      </Section>

      <Section id="operations" title="Operations & Pseudocode Logic">
        <P>
          Every operation in a properly implemented queue should run in **O(1)** constant time.
        </P>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div>
            <h4 className="text-accent-primary font-bold mb-2">Enqueue (Insertion)</h4>
            <P className="text-xs mb-4">Inserts at the rear. Must check for **Overflow** (`Rear == Size - 1`).</P>
            <CodeBlock
              title="Enqueue Snippet"
              code={`if (rear == MAX - 1) return OVERFLOW;
if (front == -1) front = 0;
items[++rear] = val;`}
            />
          </div>
          <div>
            <h4 className="text-accent-amber font-bold mb-2">Dequeue (Deletion)</h4>
            <P className="text-xs mb-4">Removes from the front. Must check for **Underflow** (`Front == -1`).</P>
            <CodeBlock
              title="Dequeue Snippet"
              code={`if (front == -1) return UNDERFLOW;
val = items[front++];
if (front > rear) front = rear = -1;`}
            />
          </div>
        </div>

        <Callout type="success" title="Helpers">
          <CodeBlock
            title="isFull & isEmpty (C)"
            code={`bool isFull() {  
    return (front == 0 && rear == SIZE - 1); 
} 

bool isEmpty() { 
    return (front == -1); 
}`}
          />
        </Callout>
      </Section>

      <Section id="variations" title="Variations of Queues">
        <div className="space-y-12">
          {/* Circular Queue */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-accent-indigo">A. Circular Queues</h3>
            <P>
              Standard linear queues suffer from **False Full Signals**: Rear might reach the end even if spaces are empty at the front. A **Circular Queue** fixes this by wrapping pointers using modulo.
            </P>
            <P className="text-sm font-mono text-accent-primary my-4">
               REAR = (REAR + 1) % MAX
            </P>
            <CircularQueueViz />
          </div>

          <hr className="border-border-color/30" />

          {/* Priority Queue */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-accent-amber">B. Priority Queues</h3>
            <P>
              Unlike standard FIFO, a Priority Queue processes elements based on a **numerical key**.
            </P>
            <BulletList items={[
              "Higher priority elements are processed first.",
              "Equal priority items follow standard FIFO order.",
              "Implemented efficiently using **Heaps**."
            ]} />
            <div className="my-6">
                <PriorityQueueViz />
            </div>
          </div>
        </div>
      </Section>

      <Section id="implementations" title="Implementation Variants">
        <P>
          In dynamic systems, queues are often implemented using **Linked Lists** to avoid memory limitations and shifting issues.
        </P>
        <div className="my-8 bg-bg-surface p-6 rounded-xl border border-border-color">
            <h4 className="font-bold mb-4">Linked List Queue Visualizer</h4>
            <LinkedListQueueViz />
        </div>
      </Section>

      <Section id="applications" title="Real-world & CS Applications">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <h4 className="font-bold text-accent-primary">Operating Systems</h4>
                <P className="text-sm">OS state transitions manage several critical queues:</P>
                <BulletList items={[
                    "**Resident Queue**: Waiting for memory allocation.",
                    "**Ready Queue**: Process is loaded and waiting for CPU time.",
                    "**Suspended Queue**: Waiting for slow I/O transfers."
                ]} />
            </div>
            <div className="space-y-4">
                <h4 className="font-bold text-accent-green">BFS Algorithms</h4>
                <P className="text-sm">Queues are the heart of **Breadth-First Search** because recursion cannot traverse horizontally.</P>
                <CodeBlock
                  title="BFS Pseudocode (Simplified)"
                  code={`BFS(root):
  Q.enqueue(root)
  while !Q.isEmpty():
    curr = Q.dequeue()
    visit(curr)
    for child in curr.children:
      Q.enqueue(child)`}
                />
            </div>
        </div>
      </Section>

      <ModuleFooter moduleId="queues" />
    </>
  );
}
