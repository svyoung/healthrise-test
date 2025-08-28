class NotificationService {
  sendNotifications(users, notification) {
    users.forEach(user => {
      try {
  user.channel.send(notification);
      } catch(e) {
        console.error('Notification failed:', e);
      }
    });
  }
}

export default new NotificationService();
