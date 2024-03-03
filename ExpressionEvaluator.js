export class ExpressionEvaluator {
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
}
