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

module.exports = new NotificationService();
