const fs = require('fs');
const path = require('path');
const ts = require('typescript');

function checkFunction(func, sourceFile, filePath) {
  if (!func.body || !ts.isBlock(func.body)) return;
  let hasReturn = false;
  let returnLine = -1;
  for (const stmt of func.body.statements) {
    if (ts.isIfStatement(stmt)) {
      // Check if the if statement always returns
      const thenStmt = stmt.thenStatement;
      if (ts.isReturnStatement(thenStmt) || (ts.isBlock(thenStmt) && thenStmt.statements.some(s => ts.isReturnStatement(s)))) {
        hasReturn = true;
        const { line } = sourceFile.getLineAndCharacterOfPosition(stmt.getStart());
        returnLine = line + 1;
      }
    } else if (ts.isReturnStatement(stmt)) {
      hasReturn = true;
      const { line } = sourceFile.getLineAndCharacterOfPosition(stmt.getStart());
      returnLine = line + 1;
    } else if (hasReturn) {
      ts.forEachChild(stmt, function inspect(node) {
        if (ts.isCallExpression(node)) {
          const text = node.expression.getText(sourceFile);
          if (/^use[A-Z]/.test(text) || text.startsWith('React.use')) {
            const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
            console.log(`HOOK AFTER CONDITIONAL RETURN in ${filePath}:${line + 1}:${character} (hook: ${text}), return was at line ${returnLine}`);
          }
        }
        ts.forEachChild(node, inspect);
      });
    }
  }
}

function visit(node, sourceFile, filePath) {
  if (
    ts.isFunctionDeclaration(node) ||
    ts.isFunctionExpression(node) ||
    ts.isArrowFunction(node) ||
    ts.isMethodDeclaration(node)
  ) {
    checkFunction(node, sourceFile, filePath);
  }
  ts.forEachChild(node, child => visit(child, sourceFile, filePath));
}

function walk(dir) {
  fs.readdirSync(dir).forEach(f => {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) walk(fp);
    else if (fp.endsWith('.tsx') || fp.endsWith('.ts')) {
      const sf = ts.createSourceFile(fp, fs.readFileSync(fp, 'utf8'), ts.ScriptTarget.Latest, true);
      visit(sf, sf, fp);
    }
  });
}

walk('src');
console.log('Hook scan complete.');
