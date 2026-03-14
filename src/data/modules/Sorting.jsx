import { Section, P, BulletList, CodeBlock, Callout } from '../../components/modules/ModuleComponents';
import ModuleFooter from '../../components/modules/ModuleFooter';
import BubbleSortViz from '../../components/visualizer/algorithms/BubbleSortViz';
import MergeSortViz from '../../components/visualizer/algorithms/MergeSortViz';
import QuickSortViz from '../../components/visualizer/algorithms/QuickSortViz';
import ShellSortViz from '../../components/visualizer/algorithms/ShellSortViz';
import HeapSortViz from '../../components/visualizer/algorithms/HeapSortViz';

export default function SortingModule() {
  return (
    <>
      <Section id="algorithms-sorting" title="The World of Sorting Algorithms">
        <P>
          Sorting is arguably the most extensively studied problem in computer science. Giving an algorithm a scrambled list and asking it to put the items in order (alphabetically or numerically) seems trivial to a human, but getting a computer to do it efficiently is remarkably complex.
        </P>
        <P>
          There are dozens of sorting algorithms, each with its own niche best use-case. We broadly categorize them into iterative `O(n²)` algorithms (like Bubble Sort) and recursive `O(n log n)` algorithms (like Merge Sort).
        </P>
      </Section>

      <Section id="bubble-sort" title="Bubble Sort">
        <P>
          Bubble Sort is the simplest sorting algorithm to understand, but also one of the slowest. It works by repeatedly stepping through the list, comparing adjacent elements, and swapping them if they are in the wrong order.
        </P>
        
        <Callout type="info" title="Why 'Bubble'?">
          It is called Bubble Sort because the largest elements tend to "bubble up" to the end of the array during each pass, while the smaller elements sink to the bottom.
        </Callout>

        <BulletList
          items={[
            "**Time Complexity - `O(n²)`**: Because of the nested loops, sorting 10,000 items requires upwards of 100,000,000 comparisons.",
            "**Space Complexity - `O(1)`**: It sorts the array 'in-place'. It doesn't require allocating any extra memory.",
            "**Stability - Stable**: If two items have the same value, they will retain their original relative order.",
          ]}
        />
      </Section>

      <Section id="implementation" title="Implementing Bubble Sort">
        <P>
          Notice the nested `for` loops. The outer loop dictates how many passes we make over the array, while the inner loop handles the adjacent comparisons for that specific pass.
        </P>

        <CodeBlock
          title="C Bubble Sort"
          code={`void bubbleSort(int arr[], int n) {
    int swapped;
    do {
        swapped = 0;
        for (int i = 0; i < n - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                int temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
                swapped = 1;
            }
        }
        n--; // Optimization: last element is now sorted
    } while (swapped);
}`}
        />

        <div className="my-8">
          <BubbleSortViz />
        </div>
      </Section>

      <Section id="merge-sort" title="Merge Sort">
        <P>
          Merge Sort is a "Divide and Conquer" algorithm. It recursively splits the array in half until it reaches arrays of size 1, and then merges those sorted sub-arrays back together.
        </P>
        
        <Callout type="success" title="Why Merge Sort?">
          Merge Sort guarantees a worst-case time complexity of O(n log n). This makes it extremely reliable for large datasets where Bubble Sort would grind your program to a halt.
        </Callout>

        <BulletList
          items={[
            "**Time Complexity - `O(n log n)`**: It consistently divides the array in half (log n steps) and merges them (n operations per step).",
            "**Space Complexity - `O(n)`**: Because we create new arrays during the split and merge process, it is not an 'in-place' sort.",
            "**Stability - Stable**: As long as the merge step prefers elements from the left array when values are equal, their relative order is maintained.",
          ]}
        />

        <CodeBlock
          title="C Merge Sort"
          code={`void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    int L[n1], R[n2];
    
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k++] = L[i++];
        } else {
            arr[k++] = R[j++];
        }
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`}
        />

        <div className="my-8">
          <MergeSortViz />
        </div>
      </Section>

      <Section id="quick-sort" title="Quick Sort">
        <P>
          Quick Sort is another "Divide and Conquer" algorithm. It works by selecting a 'pivot' element and partitioning the other elements into two sub-arrays according to whether they are less than or greater than the pivot.
        </P>
        
        <Callout type="info" title="Real World Usage">
          Quick Sort is extremely performant on average and is often the algorithm implemented under the hood in native language sorting functions, such as JavaScript's engine for `Array.prototype.sort()`.
        </Callout>

        <BulletList
          items={[
            "**Average Time Complexity - `O(n log n)`**: Usually much faster than Merge Sort in practice.",
            "**Worst Case Time Complexity - `O(n²)`**: Occurs if the worst possible pivot (e.g., the largest or smallest element) is consistently chosen.",
            "**Space Complexity - `O(log n)`**: Due to the recursive call stack.",
            "**Stability**: Not Stable.",
          ]}
        />

        <CodeBlock
          title="C Quick Sort"
          code={`void swap(int* a, int* b) {
    int t = *a;
    *a = *b;
    *b = t;
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high]; // Choose the last element as the pivot
    int i = (low - 1); 
    
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++; 
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`}
        />

        <div className="my-8">
          <QuickSortViz />
        </div>
      </Section>
      <Section id="shell-sort" title="Shell Sort">
        <P>
          Shell Sort is an optimization of Insertion Sort. It compares elements separated by a "gap" (e.g., n/2, n/4...) rather than just adjacent ones. This allows elements to "jump" across the array to their general area quickly.
        </P>
        <Callout type="info" title="The Gap Sequence">
          As the algorithm runs, the gap size decreases until it reaches 1, at which point it becomes a final, very fast insertion sort on a nearly-sorted array.
        </Callout>
        <div className="my-8">
           <ShellSortViz />
        </div>
      </Section>

      <Section id="heap-sort" title="Heap Sort">
        <P>
          Heap Sort is an in-place comparison sort that uses a Binary Heap data structure. It first builds a Max Heap from the array, then repeatedly 'extracts' the largest element from the root and moves it to the end of the array.
        </P>
        <BulletList
          items={[
            "**Time Complexity - `O(n log n)`**: Guaranteed.",
            "**Space Complexity - `O(1)`**: Unlike Merge Sort, it is in-place.",
          ]}
        />
        <div className="my-8">
           <HeapSortViz />
        </div>
      </Section>

      <Section id="non-comparison-sorts" title="Non-Comparison Sorts">
        <P>
          Some algorithms don't compare elements at all! By counting occurrences or using "buckets" based on digits, they can achieve **O(n)** time on specific types of data.
        </P>
        <BulletList
          items={[
            "**Radix Sort**: Sorts by individual digits.",
            "**Counting Sort**: Counts occurrences of each value.",
            "**Bucket Sort**: Distributes elements into several 'buckets'.",
          ]}
        />
      </Section>
      <ModuleFooter moduleId="sorting" />
    </>
  );
}
