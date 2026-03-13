import { Section, P, BulletList, CodeBlock, Callout } from '../../components/modules/ModuleComponents';
import ModuleFooter from '../../components/modules/ModuleFooter';

export default function TreesModule() {
  return (
    <>
      <Section id="what-are-trees" title="What are Trees?">
        <P>
          Unlike Arrays, Linked Lists, Stacks, and Queues which are linear, a Tree is a **hierarchical data structure**. It consists of nodes connected by edges, but strictly without any cycles.
        </P>
        <P>
          Think of a physical tree upside down, or a family tree, or the folders on your computer's hard drive. All of these are tree structures.
        </P>
        
        <Callout type="info" title="Important Terminology">
          The topmost node is called the **Root**. Any node that has child nodes is a **Parent**. Nodes with the same parent are **Siblings**. Nodes at the very bottom with no children are called **Leaves**.
        </Callout>
      </Section>

      <Section id="binary-search-trees" title="Binary Search Trees (BST)">
        <P>
          While a generic tree node can have any number of children, a **Binary Tree** restricts every node to having at most *two* children: a left child and a right child.
        </P>
        <P>
          A **Binary Search Tree** takes this a step further by enforcing a strict ordering property: For any given node `N`, every value in its left subtree must be *less* than `N`, and every value in its right subtree must be *greater* than `N`.
        </P>

        <Callout type="success" title="The Magic of BSTs">
          This simple property makes searching incredibly fast. If you are looking for the number 50 and you are currently at a node with the value 100, you instantly know that 50 *must* be in the left subtree. You can ignore the entire right half of the tree!
        </Callout>

        <BulletList
          items={[
            "Average Time Complexity: O(log n) for Search, Insert, and Delete.",
            "Worst Case (Unbalanced): O(n) - if you insert numbers in sorted order (1, 2, 3), the tree just becomes a linked list.",
          ]}
        />
      </Section>

      <Section id="implementation" title="Implementing a BST Node">
        <P>
          Implementing a Binary Search Tree starts with defining the Node structure. Notice how similar it is to a doubly-linked list, but instead of "prev" and "next", we use "left" and "right".
        </P>

        <CodeBlock
          title="C BST Node"
          code={`#include <stdio.h>
#include <stdlib.h>

struct TreeNode {
    int value;
    struct TreeNode* left;
    struct TreeNode* right;
};

struct TreeNode* createNode(int value) {
    struct TreeNode* newNode = (struct TreeNode*)malloc(sizeof(struct TreeNode));
    newNode->value = value;
    newNode->left = NULL;
    newNode->right = NULL;
    return newNode;
}

int main() {
    // Creating a simple tree manually:
    //       10
    //      /  \\
    //     5    15
    struct TreeNode* root = createNode(10);
    root->left = createNode(5);
    root->right = createNode(15);
    return 0;
}`}
        />
      </Section>
      <ModuleFooter moduleId="trees" />
    </>
  );
}
