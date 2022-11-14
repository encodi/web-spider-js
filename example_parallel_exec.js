const tasks = [
  (cb) => {
    console.log('Task 1')
    setTimeout(cb, 1000)
  },
  (cb) => {
    console.log('Task 2')
    setTimeout(cb, 1000)
  },
  (cb) => {
    console.log('Task 3')
    setTimeout(cb, 1000)
  }
]

let completed = 0;
tasks.forEach(task => {
  task(() => {
    if (++completed === tasks.length) {
      finish();
    }
  })
});

function finish() {
  // All tasks completed
  console.log('All tasks finished its async operations');
}