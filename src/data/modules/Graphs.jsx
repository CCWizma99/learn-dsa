import { Section, P, BulletList, CodeBlock, Callout, InteractiveConcept } from '../../components/modules/ModuleComponents';
import ModuleFooter from '../../components/modules/ModuleFooter';
import GraphBFSViz from '../../components/visualizer/algorithms/GraphBFSViz';
import GraphDFSViz from '../../components/visualizer/algorithms/GraphDFSViz';
import GraphRepresentationViz from '../../components/visualizer/algorithms/GraphRepresentationViz';

export default function GraphsModule() {
  return (
    <>
      <Section id="what-are-graphs" title="What are Graphs?">
        <P>
          A **Graph** is a non-linear data structure used to model relationships and connections between entities. Mathematically, a graph $G$ is represented as $G = (V, E)$, where $V$ is a set of **vertices** (or nodes) representing the entities, and $E$ is a set of **edges** (or arcs) representing the connections between those vertices.
        </P>
        <P>
          If trees are like family hierarchies, graphs are like social networks. In a tree, there is only one valid path from the root to any given node. In a graph, everything can be connected to everything else in massive intersecting webs.
        </P>
        
        <Callout type="info" title="Universal Concept">
          A Tree is actually just a very specific, restricted type of Graph! Specifically, it is a **connected acyclic undirected graph**.
        </Callout>
      </Section>

      <Section id="graph-terminology" title="1. Graph Terminology">
        <P>To master graphs, you must understand the language used to describe their properties:</P>
        <BulletList
          items={[
            "**Directed Graph (Digraph)**: Edges have a direction, represented as an ordered pair $(u, v)$. You can go from $u$ to $v$, but not vice versa unless another edge exists.",
            "**Undirected Graph**: Connections are two-way, represented as an unordered set $\{u, v\}$.",
            "**Weighted Graph (Network)**: Numerical values (weights/costs like distance or latency) are associated with each edge.",
            "**Adjacent & Incident**: If an edge connects $v_0$ and $v_1$, they are *adjacent*. The edge is *incident* on both vertices.",
            "**Degree**: The number of edges incident on a vertex. In Directed graphs, we track **In-degree** (incoming arrows) and **Out-degree** (outgoing arrows).",
            "**Path**: A sequence of vertices connecting nodes. A *simple path* has all distinct vertices. *Path length* is the number of edges.",
            "**Cycle**: A simple path with the same starting and ending vertex. Graphs without cycles are **acyclic**.",
            "**Connected & Complete**: A graph is *connected* if every pair of vertices has a path. It is *complete* if every distinct vertex is directly connected to every other vertex."
          ]}
        />
      </Section>

      <Section id="memory-representations" title="2. Graph Representations in Memory">
        <P>
          How we store a graph depends on memory efficiency and the operations we need to perform most often:
        </P>
        
        <BulletList
          items={[
            "**Adjacency Matrix**: A 2D array of size $V \\times V$. $A[i][j] = 1$ if an edge exists. High space complexity ($O(V^2)$) but constant-time ($O(1)$) edge lookup.",
            "**Adjacency List**: An array of linked lists. Each array index represents a vertex, and its list contains all its neighbors. Highly memory efficient ($O(V+E)$) for sparse graphs.",
            "**Incidence Matrix**: A $V \\times E$ matrix showing Vertex-to-Edge relationships. Useful in network flow and electrical circuit problems."
          ]}
        />

        <InteractiveConcept
          title="Memory Representation Viewer"
          description="Observe how the same graph topology is translated into Matrix and List formats in memory."
        >
          <GraphRepresentationViz />
        </InteractiveConcept>

        <Callout type="success" title="The Golden Rule">
          In 90% of practical software engineering scenarios, the **Adjacency List** is preferred for its memory efficiency on sparse real-world data.
        </Callout>
      </Section>

      <Section id="graph-traversals" title="3. Graph Traversal Operations">
        <P>
          Traversing a graph consists of systematically visiting its nodes. Unlike linear structures, we must categorize nodes as **Visited** or **Not Visited** to avoid infinite loops in cyclic graphs.
        </P>

        <div className="grid grid-cols-1 gap-12 my-10">
          <div>
            <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-accent-primary/20 flex items-center justify-center text-accent-primary text-xs">BFS</span>
              Breadth-First Search
            </h3>
            <P className="text-sm">
              Explores level-by-level (all neighbors first). Uses a **Queue** data structure.
            </P>
            <InteractiveConcept title="BFS Visualizer" description="Layer-by-layer exploration.">
              <GraphBFSViz />
            </InteractiveConcept>
            <CodeBlock
              title="BFS Pseudocode"
              code={`BFS(v):
  Initialize queue Q
  Mark v as VISITED and push to Q
  While Q is not empty:
    w = pop front of Q
    For each neighbor u of w:
      If u is NOT VISITED:
        Mark u as VISITED
        Push u to Q`}
            />
          </div>

          <div>
            <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-accent-amber/20 flex items-center justify-center text-accent-amber text-xs">DFS</span>
              Depth-First Search
            </h3>
            <P className="text-sm">
              Explores as deep as possible before backtracking. Uses a **Stack** or **Recursion**.
            </P>
            <InteractiveConcept title="DFS Visualizer" description="Deepest path exploration.">
              <GraphDFSViz />
            </InteractiveConcept>
            <CodeBlock
              title="Recursive DFS Pseudocode"
              code={`DFS(v):
  Mark v as VISITED
  For each neighbor u of v:
    If u is NOT VISITED:
      DFS(u)`}
            />
          </div>
        </div>
      </Section>

      <Section id="applications" title="4. Real-World Applications">
        <P>Graphs are the foundation of many complex systems we use daily:</P>
        <BulletList
          items={[
            "**Computer Science**: Web indexing (Google), compiler dependency tracking, and garbage collection.",
            "**Networking**: OSPF and BGP routing protocols use Dijkstra's algorithm to find the shortest physical paths between routers.",
            "**Social Networks**: Facebook uses graphs to recommend friends (based on common neighbors) and LinkedIn uses them to calculate degrees of separation.",
            "**Supply Chain**: Optimizing delivery routes and logistics using weighted graph algorithms."
          ]}
        />
      </Section>

      <ModuleFooter moduleId="graphs" />
    </>
  );
}
