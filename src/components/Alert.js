export default class Alert {
  static showError(title, text) {
    Swal.fire({
      icon: 'error',
      title,
      text
    });
  }

  static showWarning(title, text) {
    Swal.fire({
      icon: 'warning',
      title,
      text
    });
  }
}