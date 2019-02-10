# teardux
[Redux](https://github.com/reduxjs/redux), using [`rematch`](https://github.com/rematch/rematch),  *hopefully* without the tears.

**WARNING:** Work in progress, may not use `rematch` in near future.


## Example
``` typescript
import teardux from 'teardux'

type TodoItem = {
  title: string
  text: string
  complete: bool
}

const DEFAULT_TODO_ITEM: TodoItem = {
  title: '',
  text: '',
  complete: false
}

// WARNING: returns a rematch model, may change in near future
const todoModel = teardux<TodoItem>(DEFAULT_TODO_ITEM, {
  get: (id: string, rootState, callback) => {
    if (Math.random() > 0.1) return callback(new Error('ETIMEOUT'))

    setTimeout(() => {
      callback(null, {
        title: 'A title',
        text: 'A task to do',
        complete: true
      })
    }, 100)
  }
})

// ...
import { init } from '@rematch/core'

// rematch initialization
const rematch = init({
	todo: todoModel
})

// ...

function mapState (state) {
  return {
    error: state.todo.error,
    loading: state.todo.loading,
    success: state.todo.success,
    item: state.todo.result
  }
}

function mapDispatch (dispatch) {
  fetchItem: async (itemId) {
    await dispatch.todo.get(itemId)
  }
}
```

## LICENSE [MIT](LICENSE)
