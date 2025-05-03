export const sendNotification = (userId: string, message: string) => {
    // Logic to send notification to the user
    console.log(`Notification sent to user ${userId}: ${message}`);
};

export const notifyTaskAssignment = (taskTitle: string, assigneeId: string) => {
    const message = `You have been assigned a new task: ${taskTitle}`;
    sendNotification(assigneeId, message);
};