type actionFn<T> = (args, rootState, callback: (err: Error | null, state?: T) => void, dispatch?) => void

export default function model<T> (
  defaultState: T,
  actions: {
    [key: string]: actionFn<T>
  }
) {
  const initialState = {
    loading: false,
    success: false,
    error: '',
    result: defaultState
  }
  type State = typeof initialState

  function bindActions (dispatch) {
    const bound = {}
    for (let key in actions) {
      const f = actions[key]

      bound[key] = function (args, rootState) {
        const self = this as any

        return new Promise((resolve, reject) => {
          self.start()
          f(args, rootState, (err, result) => {
            if (err) {
              reject(err)
              return self.end(err)
            }

            resolve(result)
            self.end(null, result)
          }, dispatch)
        })
      }
    }

    return bound
  }

  return {
    state: initialState,
    effects: bindActions,
    reducers: {
      start (state: State): State {
        return {
          ...state,
          loading: true,
          success: false,
          error: ''
        }
      },

      end (state: State, err: Error | null, result?: T): State {
        return {
          ...state,
          loading: false,
          success: err ? false : true,
          error: err ? err.message : '',
          result: result || defaultState
        }
      },

      clear (state: State): State {
        return initialState
      },

      reset (state: State): State {
        return {
          ...state,
          loading: false,
          success: false,
          error: ''
        }
      }
    }
  }
}
