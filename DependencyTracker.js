export class DependencyTracker {
  constructor(contextManager) {
    this.dependencies = {}; // Directly map changing properties to dependent expressions
    this.contextManager = contextManager;
  }

  addDependency(dependentPath, expressionKey) {
    //console.log(`START addDependency: ${dependentPath} ${expressionKey}`);

    if (!this.dependencies[dependentPath]) {
      this.dependencies[dependentPath] = new Set();
    }
    this.dependencies[dependentPath].add(expressionKey);

    //console.log(`addDependency: Updated dependencies for ${dependentPath}:`, Array.from(this.dependencies[dependentPath]));
  }

  notifyChange(path, newValue) {
    //console.log(`- notifyChange: Dependency change notified for '${path}' with new value: '${newValue}'`);
    //console.log(`- notifyChange: this.dependencies = `, this.dependencies);
    const dependentExpressions = this.dependencies[path];
    if (dependentExpressions) {
      dependentExpressions.forEach((expressionKey) => {
        this.contextManager.reEvaluateExpression(expressionKey);
      });
    } else {
      console.error(`- notifyChange: Did not find any dependencies for '${path}'`);
    }
  }
}
