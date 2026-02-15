/**
 * ARCHITECTURE NOTE:
 * For production, swap this with Resend, SendGrid, or AWS SES.
 * This implementation uses a "Mock Logger" for development to avoid charging the user.
 */

export const emailService = {
    sendPasswordResetEmail: async (email: string, resetUrl: string) => {
        console.log('--- EMAIL OUTBOX ---');
        console.log(`To: ${email}`);
        console.log(`Subject: Reset Your Password`);
        console.log(`Body: Click here to reset your password: ${resetUrl}`);
        console.log('--------------------');

        // In production:
        // await resend.emails.send({
        //     from: 'onboarding@resend.dev',
        //     to: email,
        //     subject: 'Reset Your Password',
        //     html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
        // });

        return { success: true };
    },

    sendWelcomeEmail: async (email: string, name: string) => {
        console.log('--- EMAIL OUTBOX ---');
        console.log(`To: ${email}`);
        console.log(`Subject: Welcome to StartLabX!`);
        console.log(`Body: Hi ${name}, welcome to the platform!`);
        console.log('--------------------');
        return { success: true };
    }
};
