import { Section, P, BulletList, CodeBlock, Callout, InteractiveConcept } from '../../components/modules/ModuleComponents';
import ModuleFooter from '../../components/modules/ModuleFooter';
import QueueViz from '../../components/visualizer/algorithms/QueueViz';

export default function QueuesModule() {
  return (
    <>
      <Section id="what-are-queues" title="What are Queues?">
        <P>
          A Queue is a linear data structure that is essentially the twin sibling of a Stack. However, instead of LIFO, a Queue follows **FIFO (First-In-First-Out)**.
        </P>
        <P>
          Think of it like a line at a grocery store. The first person to get in line is the first person to get served. If you arrive late, you must join the back of the line and wait for everyone in front of you to finish.
        </P>
        
        <InteractiveConcept
          title="Queue FIFO Simulation"
          description="Enqueuing adds to the rear, while dequeuing removes from the front. First in, first out."
        >
          <QueueViz />
        </InteractiveConcept>

        <Callout type="info" title="Common Terminology">
          Adding an item to the back of the queue is called an **Enqueue**. Removing the item from the front of the queue is called a **Dequeue**.
        </Callout>
      </Section>

      <Section id="real-world" title="Real World Applications">
        <P>
          Queues are fundamental in system architecture anytime you need to process data in the exact order it was received:
        </P>
        
        <BulletList
          items={[
            "Printer Spooling: If 5 coworkers hit 'Print' at the exact same moment, the printer handles their documents in a Queue.",
            "Task Scheduling: Operating systems use Queues (and Priority Queues) to determine which background processes get CPU time next.",
            "Web Servers: When a server gets overwhelmed with requests, it places them in a Queue to process them sequentially without crashing.",
          ]}
        />
      </Section>

      <Section id="implementation" title="Implementing a Queue">
        <P>
          While you *can* implement a Queue using an Array in JavaScript, it is a bad idea for performance. 
          Remember the Golden Rule of Arrays? Deleting from the beginning of an array is an `O(n)` linear time operation because all other elements must shift left.
        </P>
        <P>
          For a highly performant Queue, we should use a Linked List under the hood! We just add to the Tail (Enqueue) and remove from the Head (Dequeue).
        </P>

        <CodeBlock
          title="C Queue (Linked List)"
          code={`#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

struct Queue {
    struct Node *front, *rear;
};

struct Node* createNode(int d) {
    struct Node* temp = (struct Node*)malloc(sizeof(struct Node));
    temp->data = d;
    temp->next = NULL;
    return temp;
}

struct Queue* createQueue() {
    struct Queue* q = (struct Queue*)malloc(sizeof(struct Queue));
    q->front = q->rear = NULL;
    return q;
}

// Enqueue: O(1)
void enqueue(struct Queue* q, int d) {
    struct Node* temp = createNode(d);
    if (q->rear == NULL) {
        q->front = q->rear = temp;
        return;
    }
    q->rear->next = temp;
    q->rear = temp;
}

// Dequeue: O(1)
void dequeue(struct Queue* q) {
    if (q->front == NULL) return;
    struct Node* temp = q->front;
    q->front = q->front->next;
    if (q->front == NULL) q->rear = NULL;
    free(temp);
}`}
        />

        <Callout type="success" title="Performance">
          By avoiding the `shift()` array method, this queue implementation achieves perfect `O(1)` constant time for both Enqueue and Dequeue operations.
        </Callout>
      </Section>

      <Section id="circular-queue" title="Circular Queues">
        <P>
          In a standard array-based queue, once the 'rear' reaches the end of the array, we can't add more items even if there's empty space at the 'front' after dequeuing. 
        </P>
        <P>
          A **Circular Queue** solves this by wrapping the 'rear' index back to the beginning of the array. This makes the queue act like a continuous circle, perfectly utilizing all reserved memory.
        </P>

        <InteractiveConcept 
          title="Circular Queue Logic"
          description="Index calculation uses the Modulo (%) operator: next_rear = (rear + 1) % size"
        >
          <CodeBlock
            title="C Circular Queue (Array)"
            code={`#define SIZE 5
int items[SIZE], front = -1, rear = -1;

void enqueue(int value) {
  if ((rear + 1) % SIZE == front) {
    printf("Queue is Full\\n");
  } else {
    if (front == -1) front = 0;
    rear = (rear + 1) % SIZE;
    items[rear] = value;
  }
}`}
          />
        </InteractiveConcept>
      </Section>
      <ModuleFooter moduleId="queues" />
    </>
  );
}
