for (let i = 1; i <= 5; i++) {
  setTimeout(() => console.log(`setTimeout ${i}`), 0);
  Promise.resolve().then(() => console.log(`Promise ${i}`));
  process.nextTick(() => console.log(`nextTick ${i}`));
  setImmediate(() => console.log(`setImmediate ${i}`));
}

console.log('Sync code');
