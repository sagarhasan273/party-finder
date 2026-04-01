// notification.service.ts
export class NotificationService {
  private static audioContext: AudioContext | null = null;

  // Simple audio element
  static playSimpleRingtone() {
    const audio = new Audio("/sounds/notification.mp3");
    audio.volume = 0.5;
    audio.play().catch((e) => console.log("Audio play failed:", e));
  }

  // Play different sounds for different events
  static playNotification(type: string) {
    let soundFile = "";

    switch (type) {
      case "join-request":
        soundFile = "/sounds/join-request.mp3";
        break;
      case "accept":
        soundFile = "/sounds/success.mp3";
        break;
      case "reject":
        soundFile = "/sounds/reject.mp3";
        break;
      case "lobby-created":
        soundFile = "/sounds/created.mp3";
        break;
      case "message":
        soundFile = "/sounds/message.mp3";
        break;
      default:
        soundFile = "/sounds/notification.mp3";
    }

    const audio = new Audio(soundFile);
    audio.volume = 0.5;
    audio.play().catch((e) => console.log("Audio play failed:", e));
  }
}
