const tasks = [
  (cb) => {
    console.log("Task 1");
    setTimeout(cb, 1000);
  },
  (cb) => {
    console.log("Task 2");
    setTimeout(cb, 1000);
  },
  (cb) => {
    console.log("Task 3");
    setTimeout(cb, 1000);
  },
];

const concurrency = 2;
let running = 0;
let index = 0;
let completed = 0;

function next() {
  while (running < concurrency && index < tasks.length) {
    const task = tasks[index++];
    task(() => {
      if (++completed === tasks.length) {
        return finish();
      }
      running--;
      next();
    });
    running++;
  }
}

next();

function finish() {
  // all tasks finished
}
