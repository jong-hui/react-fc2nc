import { SourceLocation, Transform } from 'jscodeshift';


module.exports = function (fileInfo, api, options) {
  const j = api.jscodeshift
  const AST = j(fileInfo.source)

  console.warn(
    AST.find(j.ArrowFunctionExpression)
  )

  // AST.find(j.Identifier).forEach(p => {
  //   if ((p.value.loc as any).identifierName === 'MyComponent') {
  //     console.warn(
  //       p.node
  //     )
      
  //   }
  // })

  AST.find(j.ArrowFunctionExpression).forEach(p => {
    console.warn(p)
    p.get('expression').replace(j.functionExpression)
  })

  // api.
  // transform `fileInfo.source` here
  // ...
  // return changed source
  return AST.toSource({
    useTabs: true,
    quote: 'single'
  });
} as Transform;