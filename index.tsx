type ActionsMap<T> = {
  [key: string]: (args, rootState, callback: (err: Error | null, state?: T) => void) => void
}

type EffectsMap<T> = {
  [key: string]: (args, rootState) => Promise<T>
}

export default function model<T> (
  defaultState: T,
  actions: ActionsMap<T>
) {
  const initialState = {
    loading: false,
    success: false,
    error: '',
    result: defaultState
  }
  type State = typeof initialState

  const effects: EffectsMap<T> = {}
  for (let key in actions) {
    const f = actions[key]

    effects[key] = function (args, rootState) {
      const self = this as any

      return new Promise((resolve, reject) => {
        self.start()
        f(args, rootState, (err, result) => {
          if (err) {
            self.end(err)
            return reject(err)
          }

          self.end(null, result)
          resolve(result)
        })
      })
    }
  }

  return {
    state: initialState,
    effects,
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
