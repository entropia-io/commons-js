# testing on dev-mode:

### For adding to node packages cache

```bash
npm link
```

for list linked packages:

```bash
npm ls -g --link=true --depth=0
```

for removing a linked package:

```bash
npm rm --global @entropia-io/commons-js
```

### For installing package on target project

```bash
npm link @entropia-io/commons-js --save
```

# Publishing a version

1. Commit all git changes
2. Run ```npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease
   [--preid=<prerelease-id>] | from-git]``` for generate next package version,
   check https://docs.npmjs.com/cli/version for details
3. Run ```npm run build:prod```
4. Goto dist folder ```cd dist```
5. Publish package ```npm publish```

### **Common Targets**

- **`ES5`**:

- **Use Case**: Ensures compatibility with older browsers and environments that do not support modern JavaScript
  features.
- **Example**: Internet Explorer 11, older versions of Node.js.
- **`ES2015` (ES6)**:

- **Use Case**: Modern browsers and Node.js versions. Provides more modern syntax features and is widely supported in
  recent environments.
- **Example**: Most recent versions of Chrome, Firefox, Node.js (versions from 6.x onwards).
- **`ES2017`**:

- **Use Case**: Environments that support ES2017 features such as async functions.
- **Example**: Node.js 8.x and later, modern browsers.
- **`ES2019`**:

- **Use Case**: Offers features like `Array.prototype.flat` and `Object.fromEntries`.
- **Example**: Node.js 12.x and later, recent browsers.
- **`ES2020`**:

- **Use Case**: Includes features like optional chaining and nullish coalescing.
- **Example**: Node.js 14.x and later, modern browsers.
- **`ES2022`**:

- **Use Case**: Provides the latest JavaScript features like logical assignment operators and class fields.
- **Example**: Node.js 16.x and later, up-to-date browsers.
- **`ESNext`**:

- **Use Case**: Includes the latest ECMAScript features that are still in proposal stage or not fully supported
  everywhere.
- **Example**: Cutting-edge environments, experimental use cases.

### **Typical Combinations**

- **Library for Modern Web Applications**:

- Target: `ES2015` or `ES2017`
- Module: `ESNext` or `ES6`
- **Library for Broader Compatibility**:

- Target: `ES5`
- Module: `CommonJS`
- **Library for Cutting-Edge Applications**:

- Target: `ES2022` or `ESNext`
- Module: `ESNext`