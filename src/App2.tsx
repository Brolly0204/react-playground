import { transform } from '@babel/standalone'
import type { PluginObj } from '@babel/core'

const App = () => {
  const code1 = `
  function add(a, b) {
      return a + b;
  }
  export { add };
  `;

  const url = URL.createObjectURL(new Blob([code1], { type: 'application/javascript' }))

  const code = `import { add } from './add.ts'; console.log(add(2, 3));`

  const transformImportSourcePlugin: PluginObj = {
    visitor: {
      ImportDeclaration(path) {
        console.log(path)
        path.node.source.value = url
      }
    }
  }
  const onClick = () => {
    const res = transform(code, {
      presets: ['react', 'typescript'],
      filename: 'code.ts',
      plugins: [transformImportSourcePlugin]
    })
    console.log('code', res.code)
  }
  return (
    <div>
      <button onClick={onClick}>编译</button>
    </div>
  )
}

export default App