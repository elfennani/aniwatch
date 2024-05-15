import { useReducer } from "react"



const useFormData = <T extends Record<string, any>>(initialData: T) => {
  type Action = {
    [K in keyof T]: { field: K; value: T[K] }
  }[keyof T];

  const reducer = (state: T, { field, value }: Action): T => {
    return {
      ...state,
      [field]: value
    }
  }

  const [state, dispatch] = useReducer(reducer, initialData);

  const modify = <K extends keyof T>(field: K, value: T[K]) => {
    console.log({ field, value })
    dispatch({ field, value });
  };

  return [state, modify] as const
}

export default useFormData