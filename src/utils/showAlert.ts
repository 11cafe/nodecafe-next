// Function to show a modal alert
export function showAlert(
  message: string,
  level: "error" | "info" | "success",
): void {
  // Create the modal container
  const modal = document.createElement("div");
  Object.assign(modal.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  });

  // Create the dialog
  const dialog = document.createElement("div");
  Object.assign(dialog.style, {
    padding: "20px",
    borderRadius: "5px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    maxWidth: "80%",
    backgroundColor: "#fff",
    // Initial borderColor and color will be overridden based on the alert level
    borderColor: "#000",
    color: "#000",
  });

  // Style adjustments based on the level
  switch (level) {
    case "error":
      dialog.style.borderColor = "#ff3860";
      dialog.style.color = "#ff3860";
      break;
    case "info":
      dialog.style.borderColor = "#209cee";
      dialog.style.color = "#209cee";
      break;
    case "success":
      dialog.style.borderColor = "#23d160";
      dialog.style.color = "#23d160";
      break;
  }

  // Create the message paragraph
  const messageP = document.createElement("p");
  messageP.textContent = message;

  // Append the message to the dialog, and the dialog to the modal
  dialog.appendChild(messageP);
  modal.appendChild(dialog);

  // Append the modal to the body
  document.body.appendChild(modal);

  // Function to remove the modal when clicked outside
  const removeModal = (event: MouseEvent) => {
    if (event.target === modal) {
      modal.removeEventListener("click", removeModal);
      document.body.removeChild(modal);
    }
  };

  // Attach the event listener to the modal
  modal.addEventListener("click", removeModal);
}

// Usage example:
// showAlert('This is an error message.', 'error');
// showAlert('This is an info message.', 'info');
// showAlert('This is a success message.', 'success');
