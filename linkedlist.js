class linkedlist {
  constructor(val = null, next = null) {
    this.val = val;
    this.next = next;
  }
}
// let Head = null;
// let Tail = null;

function append(value) {
  let a = new linkedlist(value);
  if (!Head) {
    Head = a;
    Tail = a;
  } else {
    Tail.next = a;
    Tail = a;
  }
  return a;
}

function prepend(value) {
  let a = new linkedlist(value, Head);
  Head = a;
  if (!Tail) Tail = a;
  return a;
}

function size() {
  let head = Head;
  let count = 0;
  while (head) {
    head = head.next;
    count++;
  }
  return count;
}

function at(index) {
  if (index < 0) return undefined;

  let head = Head;
  for (let i = 0; i < index && head; i++) head = head.next;

  return head ? head.val : undefined;
}

function pop() {
  if (!Head) return undefined;

  let removed;
  if (Head === Tail) {
    removed = Head.val;
    Head = null;
    Tail = null;

    return removed;
  }

  let prev = Head;
  while (prev.next !== Tail) prev = prev.next;

  removed = Tail.val;
  prev.next = null;

  Tail = prev;

  return removed;
}

function contains(value) {
  let node = Head;
  while (node && node.val !== value) {
    node = node.next;
  }
  if (!node) return false;
  return true;
}

function find(value) {
  let node = Head;
  let index = 0;
  while (node && node.val !== value) {
    node = node.next;
    index++;
  }
  if (!node) return undefined;
  return index;
}

// String view: ( v ) -> ( v ) -> ... -> null
function toString() {
  const parts = [];
  let node = Head;
  while (node) {
    parts.push(`( ${node.val} )`);
    node = node.next;
  }
  parts.push("null");
  return parts.join(" -> ");
}

// Insert value at index (0-based).
// Returns true on success, false if index is out of range.
function insertAt(value, index) {
  if (index < 0) return false;

  // insert at head
  if (index === 0) {
    const n = new linkedlist(value, Head);
    Head = n;
    if (!Tail) Tail = n; // was empty
    return true;
  }

  // find node before the target index
  let prev = Head;
  let i = 0;
  while (prev && i < index - 1) {
    prev = prev.next;
    i++;
  }
  if (!prev) return false; // index > length

  // link new node
  const n = new linkedlist(value, prev.next);
  prev.next = n;

  // if appended at the end, update Tail
  if (prev === Tail) Tail = n;

  return true;
}

// Remove node at index (0-based).
// Returns removed value, or undefined if index is out of range / list empty.
function removeAt(index) {
  if (index < 0 || !Head) return undefined;

  // remove head
  if (index === 0) {
    const removed = Head.val;
    Head = Head.next;
    if (!Head) Tail = null; // list became empty
    return removed;
  }

  // find node before the one to remove
  let prev = Head;
  let i = 0;
  while (prev && i < index - 1) {
    prev = prev.next;
    i++;
  }
  if (!prev || !prev.next) return undefined; // index out of bounds

  const toRemove = prev.next;
  prev.next = toRemove.next;

  // if we removed the tail, fix Tail
  if (toRemove === Tail) Tail = prev;

  return toRemove.val;
}

// ===================== LONG PRINT-BASED TEST =====================

// helper to show state nicely
function dump(label) {
  console.log(
    label.padEnd(28),
    toString(),
    "| size:",
    size(),
    "| Head:",
    Head ? Head.val : null,
    "| Tail:",
    Tail ? Tail.val : null
  );
}

// fresh start (ensure globals are empty if you rerun)
Head = null;
Tail = null;

// --- 0) Empty list edge cases ---
dump("start (empty)"); // (empty) -> "null"
console.log("pop():", pop()); // undefined
console.log("at(0):", at(0)); // undefined
console.log("contains(1):", contains(1)); // false
console.log("find(1):", find(1)); // -1  (or undefined if you chose that)
console.log("removeAt(0):", removeAt(0)); // undefined
dump("after empty ops");

// --- 1) Basic append/prepend/pop/at/size ---
append(1);
append(2);
prepend(0); // list: 0 -> 1 -> 2
dump("after append/append/prepend");

console.log("size():", size()); // 3
console.log("at(0), at(1), at(2), at(3):", at(0), at(1), at(2), at(3)); // 0 1 2 undefined
console.log("contains(2):", contains(2)); // true
console.log("contains(42):", contains(42)); // false
console.log("find(1):", find(1)); // 1
console.log("find(99):", find(99)); // -1

console.log("pop():", pop()); // 2
dump("after pop (remove tail)");
console.log("pop():", pop()); // 1
console.log("pop():", pop()); // 0
console.log("pop():", pop()); // undefined (now empty)
dump("after popping to empty");

// --- 2) Insert into empty + out-of-range insert ---
console.log("insertAt(10, 0):", insertAt(10, 0)); // true  -> [10]
dump("after insertAt(10,0)");
console.log("insertAt(99, 2):", insertAt(99, 2)); // false -> index too large
dump("after failed insertAt(99,2)");

// --- 3) Build a longer list and test insertAt in head/middle/tail ---
append(20); // [10,20]
append(40); // [10,20,40]
dump("after append 20,40");
console.log("insertAt(5, 0):", insertAt(5, 0)); // true  -> [5,10,20,40]
console.log("insertAt(30, 3):", insertAt(30, 3)); // true  -> [5,10,20,30,40]
console.log("insertAt(50, size):", insertAt(50, size())); // true -> append at end
dump("after several insertAt");

// sanity checks
console.log("at(0..5):", at(0), at(1), at(2), at(3), at(4), at(5));
// expected: 5 10 20 30 40 50  (and undefined for out of range)
console.log("contains(30):", contains(30)); // true
console.log("find(30):", find(30)); // 3

// --- 4) removeAt head/middle/tail/out-of-range ---
console.log("removeAt(0):", removeAt(0)); // removes 5 -> [10,20,30,40,50]
dump("after removeAt(0)");
console.log("removeAt(2):", removeAt(2)); // removes 30 -> [10,20,40,50]
dump("after removeAt(2)");
console.log("removeAt(size-1):", removeAt(size() - 1)); // removes 50 -> [10,20,40]
dump("after remove tail");
console.log("removeAt(99):", removeAt(99)); // undefined (no change)
dump("after failed removeAt(99)");

// --- 5) more inserts/removes to stress Head/Tail updates ---
console.log("insertAt(7, 0):", insertAt(7, 0)); // [7,10,20,40]
console.log("insertAt(60, size):", insertAt(60, size())); // [7,10,20,40,60]
console.log("insertAt(15, 2):", insertAt(15, 2)); // [7,10,15,20,40,60]
dump("post mixed insertAt");

console.log("removeAt(0):", removeAt(0)); // remove 7 -> [10,15,20,40,60]
console.log("removeAt(1):", removeAt(1)); // remove 15 -> [10,20,40,60]
console.log("removeAt(size-1):", removeAt(size() - 1)); // remove 60 -> [10,20,40]
dump("post mixed removeAt");

// --- 6) pop all again to empty; check invariants each time ---
console.log("pop():", pop()); // 40
dump("after pop");
console.log("pop():", pop()); // 20
dump("after pop");
console.log("pop():", pop()); // 10
dump("after pop (should be empty)");
console.log("pop():", pop()); // undefined

// --- 7) heavy prepend, then tail-sensitive operations ---
prepend(3);
prepend(2);
prepend(1); // [1,2,3]
dump("after 3 prepends");
console.log("append(4):", append(4).val); // -> [1,2,3,4]
console.log("append(5):", append(5).val); // -> [1,2,3,4,5]
dump("after two appends");
console.log("removeAt(size-1):", removeAt(size() - 1)); // remove 5 -> [1,2,3,4]
dump("after remove tail");
console.log("insertAt(0, 0):", insertAt(0, 0)); // [0,1,2,3,4]
console.log("insertAt(99, size()):", insertAt(99, size())); // [0,1,2,3,4,99]
dump("extended tail checks");

// --- 8) find/contains / at() at boundaries ---
console.log(
  "contains(0), contains(99), contains(123):",
  contains(0),
  contains(99),
  contains(123)
); // true true false
console.log(
  "find(0), find(4), find(99), find(123):",
  find(0),
  find(4),
  find(99),
  find(123)
); // 0, 4, 5, -1
console.log(
  "at(-1), at(size()), at(size()-1):",
  at(-1),
  at(size()),
  at(size() - 1)
); // undefined, undefined, 99

// --- 9) final cleanup: remove everything by index 0 repeatedly ---
while (size() > 0) {
  console.log("removeAt(0):", removeAt(0));
  dump("after removeAt(0)");
}
console.log("final size():", size()); // 0
console.log("final Head:", Head, "Tail:", Tail); // null null
console.log("toString():", toString()); // ... -> null

append("dog");
append("cat");
append("parrot");
append("hamster");
append("snake");
append("turtle");

console.log(toString());

// class ListNode {
//   constructor(val, next = null) {
//     this.val = val;
//     this.next = next;
//   }
// }

// class LinkedList {
//   constructor() {
//     this.head = null;
//     this.tail = null;
//     this.length = 0;
//   }

//   // O(1)
//   append(value) {
//     const node = new ListNode(value);
//     if (!this.head) {
//       this.head = node;
//       this.tail = node;
//     } else {
//       this.tail.next = node;
//       this.tail = node;
//     }
//     this.length++;
//     return this;
//   }

//   // O(1)
//   prepend(value) {
//     const node = new ListNode(value, this.head);
//     this.head = node;
//     if (this.length === 0) this.tail = node;
//     this.length++;
//     return this;
//   }

//   // O(1)
//   size() {
//     return this.length;
//   }

//   // O(n); returns the value at index, or undefined if out of bounds
//   at(index) {
//     if (index < 0 || index >= this.length) return undefined;
//     let curr = this.head;
//     for (let i = 0; i < index; i++) curr = curr.next;
//     return curr.val;
//   }

//   // O(n); removes and returns the last element (undefined if empty)
//   pop() {
//     if (this.length === 0) return undefined;

//     let removed;
//     if (this.length === 1) {
//       removed = this.head.val;
//       this.head = null;
//       this.tail = null;
//       this.length = 0;
//       return removed;
//     }

//     // find node before tail
//     let prev = this.head;
//     while (prev.next !== this.tail) prev = prev.next;

//     removed = this.tail.val;
//     prev.next = null;
//     this.tail = prev;
//     this.length--;
//     return removed;
//   }

//   // helper for debugging
//   toArray() {
//     const out = [];
//     let curr = this.head;
//     while (curr) {
//       out.push(curr.val);
//       curr = curr.next;
//     }
//     return out;
//   }
// }

// // Example usage:
// const list = new LinkedList();
// list.append(3);
// list.append(2);
// list.prepend(9);
// console.log(list.toArray());  // [9, 3, 2]
// console.log(list.at(1));      // 3
// console.log(list.pop());      // 2
// console.log(list.toArray());  // [9, 3]
// console.log(list.size());     // 2
