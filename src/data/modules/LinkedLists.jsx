import { Section, P, BulletList, CodeBlock, Callout } from '../../components/modules/ModuleComponents';
import ModuleFooter from '../../components/modules/ModuleFooter';

export default function LinkedListsModule() {
  return (
    <>
      <Section id="what-are-linked-lists" title="What are Linked Lists?">
        <P>
          A Linked List is a linear data structure, just like an Array. However, unlike arrays, Linked Lists do *not* store their elements in contiguous memory locations.
        </P>
        <P>
          Instead, the elements (called **Nodes**) are scattered randomly throughout the computer's memory. To maintain their sequential order, each node stores two pieces of information:
        </P>
        <BulletList
          items={[
            "Data: The actual value you want to store (e.g., an integer or an object).",
            "Next Pointer: A reference (or memory address) pointing to the next node in the sequence.",
          ]}
        />
        
        <Callout type="info" title="The Head and Tail">
          The very first node is called the **Head**. The very last node is called the **Tail**, and its "Next" pointer always points to `null` to signify the end of the list.
        </Callout>
      </Section>

      <Section id="time-complexity" title="Linked List Time Complexity">
        <P>
          Because nodes are scattered in memory, we lose the magic `O(1)` index lookup that arrays have. If you want the 5th element in a Linked List, you *must* start at the Head and follow the pointers 5 times.
        </P>
        
        <BulletList
          items={[
            "Access / Lookup: O(n) - Linear time. You must traverse the list from the Head.",
            "Insertion at Head: O(1) - Constant time! You just create a new node and point it to the current Head.",
            "Deletion at Head: O(1) - Constant time. You just update the Head to point to the Head's next node.",
          ]}
        />

        <Callout type="success" title="The Golden Rule of Linked Lists">
          Linked Lists shine when you need to frequently INSERT or DELETE elements at the beginning of the list, because you never have to shift elements around in memory like you do with an array. They are terrible if you need random access to elements via an index.
        </Callout>
      </Section>

      <Section id="implementation" title="Implementing a Linked List">
        <P>
          In languages like JavaScript, python, or Java, we implement a Linked List by defining a `Node` class. Here is a basic implementation of a Singly Linked List:
        </P>

        <CodeBlock
          title="C Singly Linked List"
          code={`#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next; // Important: next starts as null
};

// O(1) Insertion at the beginning
void prepend(struct Node** head_ref, int new_data) {
    struct Node* new_node = (struct Node*)malloc(sizeof(struct Node));
    new_node->data = new_data;
    new_node->next = (*head_ref);
    (*head_ref) = new_node;
}

// O(n) Traversal
void printList(struct Node* node) {
    while (node != NULL) {
        printf("%d -> ", node->data);
        node = node->next;
    }
    printf("NULL\\n");
}

int main() {
    struct Node* head = NULL;
    prepend(&head, 10);
    prepend(&head, 20); // List is now: 20 -> 10 -> NULL
    
    printList(head);
    return 0;
}`}
        />
      </Section>
      <ModuleFooter moduleId="linked-lists" />
    </>
  );
}
