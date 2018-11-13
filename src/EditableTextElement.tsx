import React, { useState, useRef, useEffect } from "react"
import PropTypes from "prop-types"

type ElementRef = ReactElementRef | null

interface ReactElementRef {
  current: any
}

export function useEditableTextAbilities(isValid = false) {
  const [isEditing, setIsEditing] = useState(false)
  // Ref used to attach to a consumer provided input
  const elRef: ElementRef = useRef(null)

  useEffect(() => {
    // if input element wasn't rendered and then renders we want to set focus
    // first render through elRef will be null regardless of if consumer attaches
    // ref to an input dom node
    if (elRef.current && elRef.current.focus) {
      elRef.current.focus()
    }
  })

  // Convenience function for setting editing mode to false on an inputs blur
  const onBlur = () => {
    // don't want to blur off if input is empty
    isValid && setIsEditing(false)
  }

  // Convenience function for setting editing mode to false on an inputs "Enter" key press
  const handleEnterKey = (e: React.KeyboardEvent) =>
    e.key === "Enter" && isValid && setIsEditing(false)

  // returns props like an hocs would essentially
  return { isEditing, setIsEditing, ref: elRef, onBlur, handleEnterKey }
}

interface EditableTextElementProps {
  value: string
  name: string
  onChange: (e: React.FormEvent<HTMLInputElement>) => void
}

// Example Usage of useEditableTextAbilities
export default function EditableTextElement({
  value,
  name,
  onChange
}: EditableTextElement) {
  const {
    isEditing,
    setIsEditing,
    ref,
    onBlur,
    handleEnterKey
  } = useEditableTextAbilities(value !== "")

  return isEditing ? (
    <input
      ref={ref}
      onBlur={onBlur}
      onChange={onChange}
      onKeyPress={handleEnterKey}
      value={value}
      name={name}
    />
  ) : (
    <div onClick={() => setIsEditing(true)}>{value}</div>
  )
}

EditableTextElement.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.oneOf([PropTypes.node, PropTypes.func])
}

EditableTextElement.defaultProps = {
  value: ""
}
