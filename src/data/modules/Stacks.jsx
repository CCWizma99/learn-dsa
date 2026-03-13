import { Section, P, BulletList, CodeBlock, Callout } from '../../components/modules/ModuleComponents';
import ModuleFooter from '../../components/modules/ModuleFooter';

export default function StacksModule() {
  return (
    <>
      <Section id="what-are-stacks" title="What are Stacks?">
        <P>
          A Stack is a linear data structure that follows a specific order for adding and removing elements: **LIFO (Last-In-First-Out)**.
        </P>
        <P>
          Think of it literally like a stack of plates at a buffet. When the dishwasher adds a clean plate, they put it on the *top* of the stack. When a hungry customer takes a plate, they take it off the *top* of the stack. You never take a plate from the bottom (without breaking everything, at least).
        </P>
        
        <Callout type="info" title="Common Terminology">
          Adding an item to the top of the stack is called a **Push**. Removing an item from the top is called a **Pop**. Looking at the top item without removing it is called a **Peek**.
        </Callout>
      </Section>

      <Section id="real-world" title="Real World Applications">
        <P>
          Stacks are incredibly ubiquitous in computer software. You use them every single day:
        </P>
        
        <BulletList
          items={[
            "Undo/Redo Mechanisms: Every time you press Ctrl+Z, your word processor 'pops' your last action off the undo stack.",
            "Browser History: When you hit the back button, the browser 'pops' your current URL off the history stack and opens the new top URL.",
            "The Call Stack: This is how programming languages keep track of nested function calls. When a function finishes executing, it is popped off the Call Stack.",
          ]}
        />
      </Section>

      <Section id="implementation" title="Implementing a Stack">
        <P>
          Because a Stack is just an abstract concept (LIFO), you can build one using either an Array or a Linked List under the hood. In JavaScript, an Array is naturally a Stack thanks to its built-in methods!
        </P>

        <CodeBlock
          title="C Array-based Stack"
          code={`#include <stdio.h>
#define MAX 100

typedef struct {
    int items[MAX];
    int top;
} Stack;

void initStack(Stack* s) {
    s->top = -1;
}

int isEmpty(Stack* s) {
    return s->top == -1;
}

// Push: O(1)
void push(Stack* s, int element) {
    if (s->top >= MAX - 1) {
        printf("Stack Overflow\\n");
        return;
    }
    s->items[++(s->top)] = element;
}

// Pop: O(1)
int pop(Stack* s) {
    if (isEmpty(s)) {
        printf("Stack Underflow\\n");
        return -1; 
    }
    return s->items[(s->top)--];
}

// Peek: O(1)
int peek(Stack* s) {
    if (isEmpty(s)) {
        printf("Stack is Empty\\n");
        return -1;
    }
    return s->items[s->top];
}`}
        />

        <Callout type="success" title="Performance">
          A properly implemented Stack operates entirely in `O(1)` constant time for Push, Pop, and Peek. You never have to iterate through the stack to add or remove an element.
        </Callout>
      </Section>
      <ModuleFooter moduleId="stacks" />
    </>
  );
}
