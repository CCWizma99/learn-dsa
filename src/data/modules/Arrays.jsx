import { Section, P, BulletList, CodeBlock, Callout } from '../../components/modules/ModuleComponents';
import ModuleFooter from '../../components/modules/ModuleFooter';

export default function ArraysModule() {
  return (
    <>
      <Section id="what-are-arrays" title="What are Arrays?">
        <P>
          An array is one of the most fundamental and universally used data structures in computer science. 
          It is a linear collection of elements, accessed via indices, and typically stored in **contiguous memory locations**.
        </P>
        <P>
          Because the elements are stored right next to each other in memory, the computer can instantly calculate the exact physical memory address of any element if it knows the starting address and the size of each element. This allows for lightning-fast lookups.
        </P>
        
        <Callout type="info" title="Contiguous Memory">
          "Contiguous" means "touching or sharing a border". If you have an array of 5 integers, those 5 integers are placed physically next to each other on the RAM stick, not scattered randomly.
        </Callout>
      </Section>

      <Section id="time-complexity" title="Array Time Complexity">
        <P>
          The contiguous nature of arrays gives them unique performance characteristics compared to other data structures like Linked Lists.
        </P>
        
        <BulletList
          items={[
            "Access / Lookup: O(1) - Constant time. You can instantly jump to array[5000].",
            "Append: O(1) - Adding to the end of a dynamic array is generally constant time (amortized).",
            "Insertion: O(n) - Linear time. If you insert an element at the beginning, every other element must physically shift one spot to the right in memory.",
            "Deletion: O(n) - Linear time. If you delete the first element, every other element must shift one spot to the left.",
          ]}
        />

        <Callout type="success" title="The Golden Rule of Arrays">
          Arrays are fantastic when you need to frequently READ data at specific indices, or add data to the end. They are terrible if you need to frequently INSERT or DELETE data at the beginning or middle.
        </Callout>
      </Section>

      <Section id="static-vs-dynamic" title="Static vs Dynamic Arrays">
        <P>
          In lower-level languages like C or Java, you must declare the size of an array when you create it. This is a **Static Array**.
        </P>

        <CodeBlock
          title="Static Array in C"
          code={`// You must declare exactly how much memory to reserve upfront
int myNumbers[5] = {10, 20, 30, 40, 50};

// ERROR: You cannot do myNumbers[5] = 60; 
// There is no reserved memory contiguous to the 5th slot.`}
        />

        <P>
          In languages like C, we actually can create dynamic arrays, but it requires explicit manual memory management using functions like `malloc` and `realloc`. Higher-level languages like JavaScript or Python handle this dynamic resizing engine under the hood for you automatically.
        </P>
        
        <CodeBlock
          title="Dynamic Array in C"
          code={`#include <stdlib.h>

// Dynamic resizing requires manual memory management in C
int size = 3;
int* myNumbers = (int*)malloc(size * sizeof(int));
myNumbers[0] = 10;
myNumbers[1] = 20;
myNumbers[2] = 30;

// To add another element, we must explicitly reallocate memory
size = 4;
myNumbers = (int*)realloc(myNumbers, size * sizeof(int));
myNumbers[3] = 40;`}
        />
      </Section>
      <ModuleFooter moduleId="arrays" />
    </>
  );
}
