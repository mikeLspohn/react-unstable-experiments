import * as React from "react"

interface OptionalRenderProps {
  display: boolean
  children: React.ReactElement<any>
}

const OptionalRender: React.FunctionComponent<OptionalRenderProps> = ({
  display,
  children
}) => (display ? children : null)

export default OptionalRender
