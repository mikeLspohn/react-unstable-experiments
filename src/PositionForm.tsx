import React from "react"

import useFormHero from "./useFormHero"
import {
  PositionFormValues,
  onSubmit,
  initialValues,
  validations
} from "./positionsForm"
import EditableTextElement from "./EditableTextElement"
import OptionalRender from "./OptionalRender"

export default function PositionForm() {
  // See, very similar to Formik, but without nested render-prop syntax hell
  const { values, errors, updateFromEvent, handleSubmit } = useFormHero({
    initialValues,
    validations,
    onSubmit
  })

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <EditableTextElement
          name="userName"
          value={values.userName}
          onChange={updateFromEvent}
          isValid={values.userName !== ""}
        />
      </div>

      <div>
        <OptionalRender display={Boolean(errors.title)}>
          <p style={{ color: "red" }}>{errors.title}</p>
        </OptionalRender>
        <input name="title" value={values.title} onChange={updateFromEvent} />
      </div>

      <div>
        <OptionalRender display={Boolean(errors.internalID)}>
          <p style={{ color: "red" }}>{errors.internalID}</p>
        </OptionalRender>

        <input
          name="internalID"
          value={values.internalID}
          type="number"
          onChange={updateFromEvent}
        />
      </div>

      <button type="submit">Add Entry</button>
    </form>
  )
}
