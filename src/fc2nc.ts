import { API, ASTPath, CallExpression, Expression, FileInfo, FunctionExpression, SourceLocation, Transform, VariableDeclarator } from 'jscodeshift';
import path from 'path'
import camelcase from 'camelcase';

const babylon = require("@babel/parser")

const defaultOptions = {
  sourceType: "module",
  allowImportExportEverywhere: true,
  allowReturnOutsideFunction: true,
  startLine: 1,
  tokens: true,
  plugins: [
    // "estree",
    ["decorators", { decoratorsBeforeExport: true }],
    "asyncGenerators",
    "bigInt",
    "classProperties",
    "classPrivateProperties",
    "classPrivateMethods",
    "legacy-decorators",
    "doExpressions",
    "dynamicImport",
    "exportDefaultFrom",
    "exportNamespaceFrom",
    "functionBind",
    "functionSent",
    "importMeta",
    "logicalAssignment",
    "nullishCoalescingOperator",
    "numericSeparator",
    "objectRestSpread",
    "optionalCatchBinding",
    "optionalChaining",
    ["pipelineOperator", { proposal: "minimal" }],
    "throwExpressions",
    "typescript",
    "jsx"
  ]
}

export const parser = {
  parse(code) {
    return babylon.parse(code, defaultOptions)
  }
}

function getModuleName(filePath: string) {
  return camelcase(
    path.parse(path.basename(filePath)).name,
    {
      pascalCase: true
    }
  )
}


export default function transform(
  fileInfo: FileInfo,
  api: API,
  options?: {}
) {
  const j = api.jscodeshift
  const AST = j(fileInfo.source)
  const moduleName = getModuleName(fileInfo.path)
  console.warn(moduleName)

  // AST.find(j.Identifier).forEach(p => {
  //   if ((p.value.loc as any).identifierName === 'MyComponent') {
  //     console.warn(
  //       p.node
  //     )
      
  //   }
  // })

  // function isArrowFunctionExpression(expression: Expression | null): boolean {
  //   console.warn(expression)
  //   if (!expression) {
  //     return false
  //   }

  //   return (
  //     expression.type === "ArrowFunctionExpression"
  //   )
  // }

  // AST
  // .findVariableDeclarators(moduleName)
  // .filter(p => {
  //   return isArrowFunctionExpression(p.node.init)
  // })
  // .forEach(p => {

  // })

  function fc2nc(
    pathOrNode: ASTPath<VariableDeclarator> | Expression | null,
    portal?: (args: any) => any
  ) {
    const path = pathOrNode as ASTPath<VariableDeclarator>
    let node = pathOrNode as Expression
    
    const isPath = path.node?.init !== undefined
    const isNode = node.type !== undefined

    if (isPath) {
      const isWrapped = path.value.init?.type === 'CallExpression'
      const isArrowFunction = path.value.init?.type === 'ArrowFunctionExpression'

      if (isWrapped) {
        const wrappedInit = (path.value.init as CallExpression)

        wrappedInit.arguments.forEach((node, index) => {
          fc2nc(node, (newNode) => {
            wrappedInit.arguments[index] = newNode
          })
        })
      }

      if (isArrowFunction) {
        const moduleInit = (path.value.init as FunctionExpression)

        path.value.init = j.functionExpression(
          j.identifier(moduleName),
          moduleInit.params,
          moduleInit.body,
          moduleInit.generator,
          moduleInit.expression,
        )
      }
    }

    if (isNode) {
      const isArrowFunction = node.type === 'ArrowFunctionExpression'

      console.warn(isArrowFunction)
      if (isArrowFunction) {
        const moduleInit = (node as FunctionExpression)

        portal?.(
          j.functionExpression(
            j.identifier(moduleName),
            moduleInit.params,
            moduleInit.body,
            moduleInit.generator,
            moduleInit.expression,
          )
        )
        // 참조 문제로 아래 코드 작동 안함
        // node = j.functionExpression(
        //   j.identifier(moduleName),
        //   moduleInit.params,
        //   moduleInit.body,
        //   moduleInit.generator,
        //   moduleInit.expression,
        // )
      }
    }

    
  }

  AST
    .findVariableDeclarators(moduleName)
    .forEach(fc2nc)

  return AST.toSource({
    useTabs: true,
    quote: 'single'
  });
};