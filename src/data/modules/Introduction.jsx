import { Section, P, BulletList, CodeBlock, Callout } from '../../components/modules/ModuleComponents';
import ModuleFooter from '../../components/modules/ModuleFooter';

export default function IntroductionModule() {
  return (
    <>
      <Section id="what-are-dsa" title="What are Data Structures and Algorithms?">
        <P>
          Welcome to the DSA Learning Platform! Before we dive into the specific structures and algorithms, 
          it's important to understand what they are and why they form the fundamental building blocks of computer science.
        </P>
        <P>
          In simple terms:
        </P>
        <BulletList
          items={[
            "**Data Structures**: Specialized formats for organizing, processing, retrieving, and storing data.",
            "**Algorithms**: A set of step-by-step instructions designed to solve a specific problem.",
            "**The Golden Rule**: Programs = Data Structures + Algorithms (coined by Niklaus Wirth).",
          ]}
        />
        <P>
          A good analogy is a library. The books are your data. A **Data Structure** is how the library is built (e.g., shelves, indexing systems, alphabetical ordering). An **Algorithm** is the specific process you use to find a particular book (e.g., "go to the 'A' section, look at the third shelf, scan left to right").
        </P>
      </Section>
      <Section id="algorithm-characteristics" title="Characteristics of a Good Algorithm">
        <P>
          Not every sequence of instructions is a "good" algorithm. In computer science, an algorithm must satisfy several strict criteria to be useful and reliable:
        </P>
        <BulletList
          items={[
            "**Input**: An algorithm must have zero or more well-defined inputs.",
            "**Output**: It must produce at least one output (the solution to the problem).",
            "**Finiteness**: It must terminate after a finite number of steps. An infinite loop is not an algorithm.",
            "**Definiteness**: Every step must be clear and unambiguous. Each instruction should mean exactly one thing.",
            "**Effectiveness**: Each step must be simple enough to be performed manually in a finite amount of time (it must be practical).",
            "**Independence**: It should be a blueprint, not tied to any specific programming language. The logic should work in `C`, `Python`, or even on paper.",
          ]}
        />
      </Section>

      <Section id="data-structure-types" title="Classification of Data Structures">
        <P>
          Data structures are the physical containers for our data. They are broadly categorized into two types:
        </P>
        <BulletList
          items={[
            "**Linear Data Structures**: Elements are arranged in a sequential order where each element has a clear 'previous' and 'next' neighbor (e.g., **Arrays**, **Stacks**, **Queues**, **Linked Lists**).",
            "**Non-Linear Data Structures**: Elements are organized in a hierarchical or interconnected web-like fashion (e.g., **Trees**, **Graphs**).",
          ]}
        />
      </Section>

      <Section id="why-it-matters" title="Why Do We Care?">
        <P>
          You might wonder: "I can just write an array and loop over it. Why do I need to learn 20 different data structures?"
          The answer usually comes down to two things: **Time** and **Space**.
        </P>
        
        <Callout type="info" title="The Trade-off Concept">
          In computer science, there is rarely a "perfect" solution. Everything is a trade-off. 
          A data structure that is incredibly fast at searching (like a Hash Table) might use significantly more memory, or be very slow at preserving order (unlike an Array).
        </Callout>

        <P>
          By understanding the underlying mechanics of Arrays, Linked Lists, Trees, and Graphs, you aren't just memorizing code—you're learning how to evaluate software engineering trade-offs. You will learn to answer questions like:
        </P>
        <BulletList
          items={[
            "How much memory will this operation use? (**Space Complexity**)",
            "How long will this operation take as the input data grows to 10 million items? (**Time Complexity**)",
            "Does this data need to be accessed randomly, or sequentially?",
            "Are we doing more reads or more writes?",
          ]}
        />
      </Section>

      <Section id="big-o" title="A Quick Primer on Big-O Notation">
        <P>
          As you read through these modules, you will constantly see references like `O(1)` or `O(n)`. This is **Big-O notation**, a mathematical formulation used to describe the limiting behavior of a function when the argument tends towards a particular value or infinity. 
        </P>
        <P>
          In practical terms, it tells us how our algorithm scales as the dataset gets bigger.
        </P>

        <BulletList
          items={[
            "**O(1)** - **Constant Time**: The operation takes the same amount of time regardless of the data size (e.g., looking up an array element by index).",
            "**O(n)** - **Linear Time**: The time taken grows linearly with the input size (e.g., looping through an array).",
            "**O(log n)** - **Logarithmic Time**: The time grows logarithmically, usually because the algorithm repeatedly halves the searchable data (e.g., Binary Search).",
            "**O(n²)** - **Quadratic Time**: The time grows exponentially, usually seen with nested loops (e.g., Bubble Sort). Generally frowned upon for large datasets.",
          ]}
        />
      </Section>

      <Section id="hello-world" title="Your First Algorithm">
        <P>
          Let's look at a very simple algorithm: finding the maximum number in an array. 
          This is an `O(n)` operation because in the worst-case scenario, we must check every single number once to guarantee we found the biggest one.
        </P>

        <CodeBlock
          title="Linear Search for Maximum (C)"
          code={`int findMax(int arr[], int n) {
    if (n == 0) return -1; // Assuming array of positive integers
    
    int max = arr[0];
    
    // We loop n times, meaning this is an O(n) algorithm
    for (int i = 1; i < n; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    
    return max;
}`}
        />

        <Callout type="success" title="Ready to begin?">
          You now have the absolute basics. Click "Arrays" in the sidebar to dive into your first real data structure.
        </Callout>
      </Section>
      <ModuleFooter moduleId="introduction" />
    </>
  );
}
