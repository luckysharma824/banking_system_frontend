/**
 * Tests for Button Component
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../Button";

describe("Button Component", () => {
  test("should render button with text", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  test("should handle click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    fireEvent.click(screen.getByText("Click Me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("should apply primary variant class", () => {
    const { container } = render(<Button variant="primary">Primary</Button>);
    const button = container.firstChild;

    expect(button).toHaveClass("btn");
    expect(button).toHaveClass("btn-primary");
  });

  test("should apply secondary variant class", () => {
    const { container } = render(
      <Button variant="secondary">Secondary</Button>
    );
    const button = container.firstChild;

    expect(button).toHaveClass("btn-secondary");
  });

  test("should apply size classes", () => {
    const { container: smallContainer } = render(
      <Button size="sm">Small</Button>
    );
    const { container: largeContainer } = render(
      <Button size="lg">Large</Button>
    );

    expect(smallContainer.firstChild).toHaveClass("btn-sm");
    expect(largeContainer.firstChild).toHaveClass("btn-lg");
  });

  test("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText("Disabled");

    expect(button).toBeDisabled();
    expect(button).toHaveClass("btn-disabled");
  });

  test("should not trigger onClick when disabled", () => {
    const handleClick = jest.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );

    fireEvent.click(screen.getByText("Disabled"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  test("should show loading state", () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
    expect(button).toHaveClass("btn-loading");
  });

  test("should apply fullWidth class", () => {
    const { container } = render(<Button fullWidth>Full Width</Button>);

    expect(container.firstChild).toHaveClass("btn-full-width");
  });

  test("should apply custom className", () => {
    const { container } = render(
      <Button className="custom-btn">Custom</Button>
    );

    expect(container.firstChild).toHaveClass("btn");
    expect(container.firstChild).toHaveClass("custom-btn");
  });
});
