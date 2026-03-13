import { Section, P, BulletList, CodeBlock, Callout, InteractiveConcept } from '../../components/modules/ModuleComponents';
import ModuleFooter from '../../components/modules/ModuleFooter';
import GraphBFSViz from '../../components/visualizer/algorithms/GraphBFSViz';

export default function GraphsModule() {
  return (
    <>
      <Section id="what-are-graphs" title="What are Graphs?">
        <P>
          A Graph is a non-linear data structure consisting of **Vertices** (or nodes) and **Edges** (lines that connect the vertices). 
        </P>
        <P>
          If trees are like family hierarchies, graphs are like social networks. In a tree, there is only one valid path from the root to any given node. In a graph, everything can be connected to everything else in massive intersecting webs.
        </P>
        
        <InteractiveConcept
          title="Graph BFS Simulation"
          description="Breadth-First Search (BFS) explores the graph layer by layer, starting from the selected node and moving to all its neighbors before going deeper."
        >
          <GraphBFSViz />
        </InteractiveConcept>

        <Callout type="info" title="Did You Know?">
          A Tree is actually just a very specific, restricted type of Graph! Specifically, it is an "undirected graph with no cycles". 
        </Callout>
      </Section>

      <Section id="types-of-graphs" title="Types of Graphs">
        <P>
          Graphs come in several variations depending on how the edges behave:
        </P>
        
        <BulletList
          items={[
            "Undirected vs Directed: In an undirected graph, a connection goes both ways (like a Facebook friendship). In a directed graph, edges have arrows (like following someone on Twitter—they don't have to follow back).",
            "Unweighted vs Weighted: In an unweighted graph, all connections are equal. In a weighted graph, some connections are \"more expensive\" or longer than others (like Google Maps calculating the absolute fastest route based on traffic).",
            "Cyclic vs Acyclic: If you can start at node A, follow a path, and end up back at node A, the graph has a cycle.",
          ]}
        />
      </Section>

      <Section id="representation" title="How to Represent a Graph in Code">
        <P>
          Unlike a Tree where we can just use recursive `left` and `right` pointers, Graphs are typically represented in code in two ways: An **Adjacency Matrix** (a 2D grid) or an **Adjacency List** (a Map of arrays).
        </P>
        <P>
          In 90% of practical software engineering scenarios, the Adjacency List is preferred because it uses significantly less memory for sparse graphs.
        </P>

        <CodeBlock
          title="C Adjacency List"
          code={`#include <stdio.h>
#include <stdlib.h>

struct Node {
    int dest;
    struct Node* next;
};

struct AdjList {
    struct Node *head; 
};

struct Graph {
    int V; // Number of vertices
    struct AdjList* array;
};

struct Node* createNode(int dest) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->dest = dest;
    newNode->next = NULL;
    return newNode;
}

struct Graph* createGraph(int V) {
    struct Graph* graph = (struct Graph*)malloc(sizeof(struct Graph));
    graph->V = V;
    graph->array = (struct AdjList*)malloc(V * sizeof(struct AdjList));

    for (int i = 0; i < V; ++i) {
        graph->array[i].head = NULL;
    }
    return graph;
}

// Adding an undirected edge
void addEdge(struct Graph* graph, int src, int dest) {
    // Add edge from src to dest
    struct Node* newNode = createNode(dest);
    newNode->next = graph->array[src].head;
    graph->array[src].head = newNode;

    // Add edge from dest to src (undirected)
    newNode = createNode(src);
    newNode->next = graph->array[dest].head;
    graph->array[dest].head = newNode;
}`}
        />
        <Callout type="success" title="Representation Choice">
          90% of graph problems use **Adjacency Lists** for efficiency. However, if your graph is very dense (edges connecting almost every pair), an **Adjacency Matrix** is faster.
        </Callout>
      </Section>

      <Section id="incidence-matrix" title="Incidence Matrix">
        <P>
          While adjacency representations focus on **Vertex-to-Vertex** connections, an **Incidence Matrix** focus on **Vertex-to-Edge** relationships.
        </P>
        <BulletList
          items={[
            "Structure: A 2D array where rows are vertices and columns are edges.",
            "Encoding: A cell is 1 if the vertex is an endpoint of the edge, 0 otherwise.",
          ]}
        />
      </Section>
      <ModuleFooter moduleId="graphs" />
    </>
  );
}
