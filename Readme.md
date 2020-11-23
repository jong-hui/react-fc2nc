## React-fc2nc

디버깅 하기 힘들어서 만듬


```zsh
npx react-fc2nc src/test.tsx
```

### test.tsx

```
export const Test = Hoc(observer(() => {
  return (
    <div>
      myComponent
    </div>
  )
}))
```

### test.result.tsx

```
export const Test = Hoc(observer(function Test() {
  return (
    <div>
      myComponent
    </div>
  )
}))
```


### Before deploy

- npm run test