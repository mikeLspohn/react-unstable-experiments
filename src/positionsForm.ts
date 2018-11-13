// Interfaces
export interface PositionFormValues {
  title: string
  internalID: string
  userName: string
}

export interface PositionFormErrors {
  title?: string
  internalID?: string
}

// Form Functions
export const validations = [
  (state: PositionFormValues): PositionFormErrors =>
    state.title ? {} : { title: "Title is required" },
  (state: PositionFormValues): PositionFormErrors =>
    state.internalID ? {} : { internalID: "Internal ID is required" }
]

export const initialValues: PositionFormValues = {
  title: "",
  internalID: "",
  userName: "Picollo"
}

export const onSubmit = (values: PositionFormValues) => {
  console.log(values)
}
