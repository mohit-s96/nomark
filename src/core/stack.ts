class Stack<T> {
  private stack: Array<T> = [];

  push(item: T) {
    this.stack.push(item);
  }

  pop(): T {
    return this.stack.pop() || ("" as unknown as T);
  }

  size(): number {
    return this.stack.length;
  }

  isEmpty(): boolean {
    return this.stack.length === 0;
  }

  top(): T {
    return this.stack[this.size() - 1] || ("" as unknown as T);
  }
}

export default Stack;
