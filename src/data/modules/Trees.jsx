import { Section, P, BulletList, CodeBlock, Callout, InteractiveConcept, ComparisonTable } from '../../components/modules/ModuleComponents';
import ModuleFooter from '../../components/modules/ModuleFooter';
import BSTViz from '../../components/visualizer/algorithms/BSTViz';

export default function TreesModule() {
  return (
    <>
      <Section id="what-are-trees" title="Introduction to Trees">
        <P>
          A **Tree** is a non-linear data structure that organizes data objects based on hierarchical relationships, similar to a family tree where children are grouped under parents.
        </P>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <InteractiveConcept title="Hierarchical Nature" description="Nodes are organized in levels, representing parent-child relationships.">
             <BulletList items={["Operating Systems (File directories)", "Compilers (Syntax validation)", "Searching algorithms"]} />
          </InteractiveConcept>
          <div className="p-8 bg-bg-surface border border-border-color rounded-lg text-sm text-center flex flex-col items-center">
             <div className="font-bold text-accent-primary mb-6 uppercase tracking-wider text-xs">A Basic Tree Structure</div>
             <div className="relative flex flex-col items-center">
                {/* Node A (Root) */}
                <div className="w-12 h-12 rounded-full border-2 border-accent-primary flex items-center justify-center font-bold bg-accent-primary/10 text-accent-primary z-20 relative shadow-lg">A</div>
                
                {/* Branching Connector Lines */}
                <svg className="absolute top-12 left-1/2 -translate-x-1/2 w-48 h-12 z-10 overflow-visible pointer-events-none">
                  <path 
                    d="M 96 0 L 32 48 M 96 0 L 160 48" 
                    stroke="var(--accent-primary)" 
                    strokeWidth="3" 
                    fill="none" 
                    strokeLinecap="round"
                    className="opacity-40"
                  />
                </svg>

                <div className="flex gap-20 mt-12">
                   {/* Node B (Left Child) */}
                   <div className="flex flex-col items-center relative">
                      <div className="w-12 h-12 rounded-full border-2 border-border-color flex items-center justify-center font-bold text-text-muted bg-bg-surface z-20 shadow-md">B</div>
                      <span className="text-[10px] mt-2 font-medium text-accent-primary">Left Child</span>
                   </div>
                   {/* Node C (Right Child) */}
                   <div className="flex flex-col items-center relative">
                      <div className="w-12 h-12 rounded-full border-2 border-border-color flex items-center justify-center font-bold text-text-muted bg-bg-surface z-20 shadow-md">C</div>
                      <span className="text-[10px] mt-2 font-medium text-accent-primary">Right Child</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
        
        <Callout type="info" title="Basic Terminology">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <p>• <strong>Root</strong>: The topmost node; if NULL, the tree is empty.</p>
            <p>• <strong>Leaf/Terminal Node</strong>: A node with no children (degree 0).</p>
            <p>• <strong>Sub-trees</strong>: Disjoint sets of nodes under the root.</p>
            <p>• <strong>Path</strong>: A sequence of consecutive edges.</p>
            <p>• <strong>Ancestor</strong>: Any predecessor on the path from root to node.</p>
            <p>• <strong>Level/Depth</strong>: Level 0 (Root), Level 1 (Children), etc.</p>
            <p>• <strong>Height</strong>: Length of the longest path from node to a leaf.</p>
            <p>• <strong>Degree</strong>: Number of sub-trees a node has.</p>
          </div>
        </Callout>
      </Section>

      <Section id="memory-representation" title="Memory Representation">
        <P>Trees can be represented in two primary ways in computer memory:</P>
        <div className="space-y-4">
          <InteractiveConcept title="1. Linked Representation (Pointers)" description="The most common flexible method.">
            <P>Each node contains data and pointers to its children (e.g., left and right).</P>
            <CodeBlock title="C Node Structure" code={`struct Node {
    int data;
    struct Node *left;
    struct Node *right;
};`} />
          </InteractiveConcept>
          <InteractiveConcept title="2. Sequential Representation (Arrays)" description="Used mainly for Complete Binary Trees.">
            <P>Mapped to an array where root is at index 1.</P>
            <BulletList items={[
              "Root is at index 1",
              "Left child of node K is at 2 * K",
              "Right child of node K is at 2 * K + 1"
            ]} />
          </InteractiveConcept>
        </div>
      </Section>

      <Section id="types-of-trees" title="Types of Trees">
        <ComparisonTable 
          headers={["Type", "Characteristic", "Key Property"]}
          rows={[
            ["Binary Tree", "Max 2 children per node", "At most 2^L nodes at Level L"],
            ["Complete Binary Tree", "All levels filled except last", "Populated as far left as possible"],
            ["Full Binary Tree", "All internal nodes have 2 children", "Total nodes = 2^(d+1) - 1"],
            ["Expression Tree", "Internal nodes are operators", "Leaves are operands"],
            ["BST", "Ordered Binary Tree", "Left &lt; Root &le; Right"],
            ["AVL Tree", "Self-balancing BST", "Height diff (Balance Factor) &le; 1"],
            ["Heap", "Complete tree, parent &ge; children", "No gaps in array implementation"]
          ]}
        />
      </Section>

      <Section id="bst-visualizer" title="Interactive BST Operations">
        <P>
          Experience core BST operations: Insert, Search, Deletion, and Mirroring. Each operation updates the Algorithm Trace in real-time.
        </P>
        <div className="my-8">
           <BSTViz />
        </div>
      </Section>

      <Section id="bst-logic" title="Binary Search Tree Logic">
        <P>A Binary Search Tree (BST) provides efficient O(log n) operations by keeping items ordered.</P>
        <div className="space-y-6">
          <InteractiveConcept title="BST Insertion" description="Traverses until it finds a NULL spot.">
            <CodeBlock title="Pseudocode" code={`Insert(TREE, VAL)
Step 1: IF TREE = NULL
            Allocate memory for TREE
            SET TREE -> DATA = VAL
            SET TREE -> LEFT = TREE -> RIGHT = NULL
        ELSE
            IF VAL < TREE -> DATA
                Insert(TREE -> LEFT, VAL)
            ELSE
                Insert(TREE -> RIGHT, VAL)
            [END OF IF]
        [END OF IF]
Step 2: END`} />
          </InteractiveConcept>

          <InteractiveConcept title="BST Deletion" description="Handles 3 cases: Leaf, 1 Child, 2 Children.">
            <CodeBlock title="Pseudocode" code={`Delete(TREE, VAL)
Step 1: IF TREE = NULL
            Write "VAL not found"
        ELSE IF VAL < TREE -> DATA
            Delete(TREE->LEFT, VAL)
        ELSE IF VAL > TREE -> DATA
            Delete(TREE->RIGHT, VAL)
        ELSE IF TREE->LEFT AND TREE->RIGHT
            SET TEMP = findLargestNode(TREE->LEFT)
            SET TREE->DATA = TEMP->DATA
            Delete(TREE->LEFT, TEMP->DATA)
        ELSE
            IF TREE->LEFT == NULL AND TREE->RIGHT == NULL
                SET TREE = NULL
            ELSE if TREE->LEFT != NULL
                SET TREE = TREE->LEFT
            ELSE SET TREE = TREE->RIGHT
            FREE TEMP
        [END OF IF]`} />
          </InteractiveConcept>
        </div>
      </Section>

      <Section id="traversals" title="Tree Traversals">
        <P>Methods to visit every node in a tree. Depth-first traversals are typically implemented recursively.</P>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InteractiveConcept title="Pre-Order" description="Root → Left → Right">
            <CodeBlock title="Step-by-Step" code={`Step 1: Write TREE -> DATA
Step 2: PREORDER(TREE -> LEFT)
Step 3: PREORDER(TREE -> RIGHT)`} />
          </InteractiveConcept>
          <InteractiveConcept title="In-Order" description="Left → Root → Right">
            <CodeBlock title="Step-by-Step" code={`Step 1: INORDER(TREE -> LEFT)
Step 2: Write TREE -> DATA
Step 3: INORDER(TREE -> RIGHT)`} />
          </InteractiveConcept>
          <InteractiveConcept title="Post-Order" description="Left → Right → Root">
            <CodeBlock title="Step-by-Step" code={`Step 1: POSTORDER(TREE -> LEFT)
Step 2: POSTORDER(TREE -> RIGHT)
Step 3: Write TREE -> DATA`} />
          </InteractiveConcept>
        </div>
        <Callout type="info" title="Breadth-First (Level-Order)">
          <P>Uses a **Queue** to visit nodes level-by-level. This is useful for finding the shortest path in some algorithms.</P>
        </Callout>
      </Section>

      <Section id="advanced-ops" title="Properties & Mirroring">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InteractiveConcept title="Height & Size" description="Recursive structural counts.">
              <CodeBlock title="Height" code={`Height(T) = 1 + max(Height(T->L), Height(T->R))`} />
              <CodeBlock title="Size" code={`Size(T) = 1 + Size(T->L) + Size(T->R)`} />
            </InteractiveConcept>
            <InteractiveConcept title="Tree Mirroring" description="Swapping all children.">
              <P>Converts a tree into its mirror image by recursively swapping left and right pointers.</P>
              <CodeBlock title="Mirroring Logic" code={`SET TEMP = TREE->LEFT
TREE->LEFT = TREE->RIGHT
TREE->RIGHT = TEMP`} />
            </InteractiveConcept>
          </div>
        </div>
      </Section>

      <Section id="heaps" title="Heaps & Priority Queues">
        <P>A Heap is a complete binary tree where the parent value is always greater than or equal to (Max-Heap) its children.</P>
        <InteractiveConcept title="Heap Insertion" description="Append and bubble up.">
          <CodeBlock title="Algorithm" code={`N++; A[N] = X; Upheap(N);`} />
        </InteractiveConcept>
      </Section>

      <ModuleFooter moduleId="trees" />
    </>
  );
}
