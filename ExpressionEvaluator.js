export class ExpressionEvaluator {
<<<<<<< HEAD
    // Evaluates an expression within a given context
    static evaluate(expression, context) {
        //console.error(`START Evaluating expression: '${expression}' with context:`, JSON.stringify(context));

        return expression.replace(/\{\{(.*?)\}\}/g, (_, path) => {
            const levels = path.trim().split('.');
            let currentContext = context;
            for (const level of levels) {
                if (level in currentContext) {
                    currentContext = currentContext[level];
                } else {
                    console.error(`Path not found in context: ${path}`);
                    return "";
                }
            }
            //console.log(`Replacement for path '${path}': ${currentContext}`);
            return currentContext;
        });
    }
=======
  static TEMPLATE_REGEX = /\{\{(.*?)\}\}/g;

  // Evaluates an expression within a given context
  static evaluate(expression, context) {
    console.log(`START Evaluating expression: '${expression}' with context:`, JSON.stringify(context, null, 2));

    return expression.replace(ExpressionEvaluator.TEMPLATE_REGEX, (_, path) => {
      const levels = path.trim().split(".");
      let currentContext = context;
      for (const level of levels) {
        if (level in currentContext) {
          currentContext = currentContext[level];
          console.log(`ExpressionEvaluator.eval(): currentContext = '${JSON.stringify(currentContext)}'`);
        } else {
          console.error(`Path not found in context: ${path}`);
          return "";
        }
      }
      //console.log(`Replacement for path '${path}': ${currentContext}`);
      return currentContext;
    });
  }
>>>>>>> 29cb4e2 (new)
}
