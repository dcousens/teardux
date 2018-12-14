# teardux
[Redux](https://github.com/reduxjs/redux), using [`rematch`](https://github.com/rematch/rematch),  *hopefully* without the tears.

**WARNING:** Work in progress, may not use `rematch` in near future.


## Example
``` typescript
import teardux from 'teardux'

interface Item {
  title: string
  text: string
  complete: bool
}

const DEFAULT_ITEM = {
  title: '',
  text: '',
  complete: false
}

// rematch model, for now
const model = teardux<Item>(DEFAULT_ITEM, {
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

function mapState (state) {
  return {
	error: state.todo.error,
	loading: state.todo.loading,
	success: state.todo.success,
    item: state.todo.result
  }
}

function mapDispatch (dispatch) {
  fetchItem: (itemId) {
    dispatch.todo.get(itemId)
  }
}

```
