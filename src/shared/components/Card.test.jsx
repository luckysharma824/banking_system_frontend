/**
 * Tests for Card Component
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { Card } from "../Card";

describe("Card Component", () => {
  test("should render children content", () => {
    render(
      <Card>
        <div>Card Content</div>
      </Card>
    );

    expect(screen.getByText("Card Content")).toBeInTheDocument();
  });

  test("should apply default variant class", () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild;

    expect(card).toHaveClass("card");
    expect(card).toHaveClass("card-default");
  });

  test("should apply elevated variant class", () => {
    const { container } = render(<Card variant="elevated">Content</Card>);
    const card = container.firstChild;

    expect(card).toHaveClass("card-elevated");
  });

  test("should apply outlined variant class", () => {
    const { container } = render(<Card variant="outlined">Content</Card>);
    const card = container.firstChild;

    expect(card).toHaveClass("card-outlined");
  });

  test("should apply custom className", () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    const card = container.firstChild;

    expect(card).toHaveClass("card");
    expect(card).toHaveClass("custom-class");
  });

  test("should forward additional props", () => {
    const { container } = render(
      <Card data-testid="test-card" style={{ padding: "20px" }}>
        Content
      </Card>
    );

    const card = container.firstChild;
    expect(card).toHaveAttribute("data-testid", "test-card");
    expect(card).toHaveStyle({ padding: "20px" });
  });

  test("should render with header when provided", () => {
    render(
      <Card>
        <Card.Header>Header Content</Card.Header>
        <Card.Body>Body Content</Card.Body>
      </Card>
    );

    expect(screen.getByText("Header Content")).toBeInTheDocument();
    expect(screen.getByText("Body Content")).toBeInTheDocument();
  });
});
