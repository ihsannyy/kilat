interface User {
  name: string;
  role: string;
}

const user: User = {
  name: "Kilat User",
  role: "Developer"
};

console.log(`Hello from TypeScript! Name: ${user.name}, Role: ${user.role}`);

import _ from "lodash";
if (_) {
  console.log("ESM lodash import works! Chunk result:", _.chunk([1, 2, 3, 4], 2));
}
