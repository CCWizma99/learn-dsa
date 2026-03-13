import { Section, P, BulletList, CodeBlock, Callout, InteractiveConcept, ComparisonTable } from '../../components/modules/ModuleComponents';
import ModuleFooter from '../../components/modules/ModuleFooter';
import LinkedListViz from '../../components/visualizer/algorithms/LinkedListViz';
import DoublyLinkedListViz from '../../components/visualizer/algorithms/DoublyLinkedListViz';
import CircularLinkedListViz from '../../components/visualizer/algorithms/CircularLinkedListViz';
import LinkedListStackViz from '../../components/visualizer/algorithms/LinkedListStackViz';
import LinkedListQueueViz from '../../components/visualizer/algorithms/LinkedListQueueViz';

export default function LinkedListsModule() {
  return (
    <>
      <Section id="intro" title="Introduction to List Structures">
        <P>
          Data can be organized in memory using two main structures: **Arrays** and **Linked Lists**. While an array stores elements in contiguous locations, a Linked List uses a more flexible approach.
        </P>
        <ComparisonTable 
          headers={["Feature", "Arrays", "Linked Lists"]}
          rows={[
            ["Memory", "Contiguous (consecutive locations)", "Non-contiguous (scattered)"],
            ["Size", "Fixed (must specify at declaration)", "Dynamic (grows/shrinks at runtime)"],
            ["Insertion/Deletion", "Inefficient (requires shifting)", "Efficient (no shifting)"],
            ["Access", "Random Access (O(1) indexing)", "Sequential Access (O(n) traversal)"],
            ["Memory Waste", "Possible if array is not full", "No waste (allocated on demand)"]
          ]}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InteractiveConcept title="Array Advantages" description="Fast lookups and simple handling.">
            <BulletList items={["Direct access via index", "Stored in contiguous memory", "Easy handling of large datasets"]} />
          </InteractiveConcept>
          <InteractiveConcept title="Linked List Advantages" description="Dynamic growth and fast insertions.">
            <BulletList items={["Dynamic size allocation", "Efficient insertions at any point", "No memory loss from fixed pre-allocation"]} />
          </InteractiveConcept>
        </div>
      </Section>

      <Section id="dynamic-memory" title="Memory Management in C">
        <P>
          Linked lists rely on **Dynamic Memory Allocation**, where memory is allocated at run-time from a special area called the **Heap**. In C, this is managed using `stdlib.h` functions.
        </P>
        <div className="space-y-4">
          <InteractiveConcept title="malloc()" description="Memory Allocation">
            <CodeBlock title="Syntax" code="ptr = (cast-type*) malloc(byte-size);" />
            <P>Reserves a block of memory and returns a void pointer. Returns NULL if allocation fails.</P>
          </InteractiveConcept>
          <InteractiveConcept title="calloc()" description="Contiguous Allocation">
            <CodeBlock title="Syntax" code="ptr = (cast-type*) calloc(n, element-size);" />
            <P>Allocates multiple blocks of memory initialized to zero.</P>
          </InteractiveConcept>
          <InteractiveConcept title="free()" description="Releasing Memory">
            <CodeBlock title="Syntax" code="free(ptr);" />
            <P>Releases dynamically allocated memory. Crucial to prevent memory leaks!</P>
          </InteractiveConcept>
        </div>
      </Section>

      <Section id="what-is-linked-list" title="What is a Linked List?">
        <P>
          A linked list is a collection of **Nodes**. Each node consists of two fields:
        </P>
        <BulletList items={[
          "Data (Info field): Stores the actual information.",
          "Link (Address field): Stores the address of the next node in the sequence."
        ]} />
        <Callout type="info" title="Basic Terminology">
          <div className="space-y-1">
            <p>• <strong>START / HEAD</strong>: A pointer variable that stores the address of the first node.</p>
            <p>• <strong>NULL</strong>: Stored in the NEXT field of the last node to mark the end of the list.</p>
            <p>• <strong>OVERFLOW</strong>: Occurs when memory is full and a new node cannot be allocated.</p>
            <p>• <strong>UNDERFLOW</strong>: Occurs when attempting to delete from an empty list.</p>
          </div>
        </Callout>
      </Section>

      <Section id="implementation" title="Interactive Singly Linked List">
        <P>
          Explore all basic operations: Traversal, Searching, Insertion, and Deletion. Watch how the <strong>PTR</strong> and <strong>PREPTR</strong> variables move during the execution.
        </P>
        <div className="my-8">
           <LinkedListViz />
        </div>
        <P>
          Implementation of a node structure in C:
        </P>
        <CodeBlock 
          title="Node Structure"
          code={`struct node {
    int data;
    struct node *next;
};
struct node *start = NULL;`}
        />
      </Section>

      <Section id="variants" title="Linked List Variants">
        <div className="space-y-8">
          <InteractiveConcept title="Circular Linked List" description="Last node points back to the first, creating a loop.">
            <CircularLinkedListViz />
            <BulletList items={[
              "No NULL values in the next part",
              "Infinite traversal possible",
              "Used in Operating Systems for task maintenance (Round Robin)"
            ]} />
          </InteractiveConcept>

          <InteractiveConcept title="Doubly Linked List" description="Bidirectional navigation using 'next' and 'prev' pointers.">
             <DoublyLinkedListViz />
             <BulletList items={[
              "Easier deletion of a given node (O(1) if pointer is given)",
              "Backward traversal enabled",
              "Consumes more memory (extra pointer per node)"
            ]} />
          </InteractiveConcept>

          <InteractiveConcept title="Header Linked List" description="Contains a special meta-node (Header Node) at the beginning.">
             <P>The START pointer points to a 'Header Node' instead of the first data node. The Header node can store list metadata like total node count.</P>
             <div className="p-4 bg-bg-surface border border-border-color rounded-lg text-sm italic text-text-muted text-center border-dashed">
                [Header Node (Meta)] → [Node 1] → [Node 2] → NULL
             </div>
          </InteractiveConcept>
        </div>
      </Section>

      <Section id="apps-ll" title="Linked List Based Stacks & Queues">
        <P>
          Linked lists are ideal for implementing other linear structures because of their dynamic size. Unlike array-based implementations, there is no need to pre-define capacity.
        </P>
        <div className="space-y-12 my-8">
           <InteractiveConcept title="Linked Stack" description="Push and Pop operations only happen at the TOP (Head).">
              <LinkedListStackViz />
           </InteractiveConcept>
           <InteractiveConcept title="Linked Queue" description="Enqueue at REAR and Dequeue from FRONT.">
              <LinkedListQueueViz />
           </InteractiveConcept>
        </div>
      </Section>

      <Section id="applications" title="Real-world Applications">
        <BulletList items={[
          "Polynomial Representation (storing coefficients and powers)",
          "Implementing Stacks and Queues (as seen above)",
          "Dynamic memory management",
          "Image viewers (Doubly Linked List for next/prev images)",
          "Web Browser History (Circular Linked List)"
        ]} />
      </Section>

      <ModuleFooter moduleId="linked-lists" />
    </>
  );
}
