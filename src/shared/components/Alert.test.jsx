/**
 * Tests for Alert Component
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Alert } from "../Alert";

describe("Alert Component", () => {
  test("should render alert with message", () => {
    render(<Alert>Test Alert Message</Alert>);
    expect(screen.getByText("Test Alert Message")).toBeInTheDocument();
  });

  test("should apply success variant class", () => {
    const { container } = render(<Alert variant="success">Success</Alert>);
    const alert = container.firstChild;

    expect(alert).toHaveClass("alert");
    expect(alert).toHaveClass("alert-success");
  });

  test("should apply error variant class", () => {
    const { container } = render(<Alert variant="error">Error</Alert>);
    const alert = container.firstChild;

    expect(alert).toHaveClass("alert-error");
  });

  test("should apply warning variant class", () => {
    const { container } = render(<Alert variant="warning">Warning</Alert>);
    const alert = container.firstChild;

    expect(alert).toHaveClass("alert-warning");
  });

  test("should apply info variant class", () => {
    const { container } = render(<Alert variant="info">Info</Alert>);
    const alert = container.firstChild;

    expect(alert).toHaveClass("alert-info");
  });

  test("should show close button when dismissible", () => {
    render(<Alert dismissible>Dismissible Alert</Alert>);
    const closeButton = screen.getByLabelText("Close alert");

    expect(closeButton).toBeInTheDocument();
  });

  test("should call onClose when close button clicked", () => {
    const handleClose = jest.fn();
    render(
      <Alert dismissible onClose={handleClose}>
        Dismissible Alert
      </Alert>
    );

    const closeButton = screen.getByLabelText("Close alert");
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test("should not show close button when not dismissible", () => {
    render(<Alert>Non-dismissible Alert</Alert>);
    const closeButton = screen.queryByLabelText("Close alert");

    expect(closeButton).not.toBeInTheDocument();
  });

  test("should render title when provided", () => {
    render(<Alert title="Alert Title">Alert Message</Alert>);

    expect(screen.getByText("Alert Title")).toBeInTheDocument();
    expect(screen.getByText("Alert Message")).toBeInTheDocument();
  });

  test("should apply custom className", () => {
    const { container } = render(<Alert className="custom-alert">Alert</Alert>);

    expect(container.firstChild).toHaveClass("alert");
    expect(container.firstChild).toHaveClass("custom-alert");
  });
});
