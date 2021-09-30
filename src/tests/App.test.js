import { render, screen } from "@testing-library/react"
import App from "../App"

test("displays courses", () => {
  render(<App />)
  const linkElement = screen.getByText(/Courses/)
  expect(linkElement).toBeInTheDocument()
})
