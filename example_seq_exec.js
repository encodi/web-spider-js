function asyncOperation(cb) {
  process.nextTick(cb);
}

function task1(cb) {
  asyncOperation(() => {
    console.log(1);
    task2(cb);
  });
}

function task2(cb) {
  asyncOperation(() => {
    console.log(2);
    task3(cb);
  });
}

function task3(cb) {
  asyncOperation(() => {
    console.log(3);
    cb();
  });
}

task1(() => {
  console.log('tasks 1,2,3 executed');
});