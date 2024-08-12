import { ContactForm, SendContactEmailRequest, SendContactEmailResponse } from "living-mile-high-lib";
import { ExpressEndpoint } from "~/@types";
import { ContactLogRecord } from "~/@types/database";
import { services } from "~/di";
import sgMail from "@sendgrid/mail";
import env from "~/config/env";

export const sendContactEmail: ExpressEndpoint = async (req, res) => {
    const body: SendContactEmailRequest = req.body;
    const contactForm: ContactForm = body;

    try {
        await withLogCheck(req.ip, contactForm.email, async () => {
            await sendMessage(contactForm);
        });

        const successResponse: SendContactEmailResponse = { success: true };
        res.json(successResponse);
    } catch (error: any) {
        const errorResponse: SendContactEmailResponse = { success: false, error: error.message };
        console.log(errorResponse);
        res.json(errorResponse);
    }
}

async function withLogCheck(ip: string | undefined, email: string, fn: () => Promise<void>) {
    const { contactLogService } = services();
    if (!ip) {
        throw new Error('IP not found');
    }

    const log: ContactLogRecord = {
        ip,
        email,
        createdAt: new Date(),
    };

    const canSendEmail = await contactLogService.canSendEmail(log);

    if (!canSendEmail) {
        throw new Error('Request fulfilled too recently. Try again tomorrow.');
    }

    await fn();

    await contactLogService.logEmail(log);
}

async function sendMessage(form: ContactForm) {
    const { from, to } = initSendgrid();
    const messageText = createEmailBody(form);

    await sgMail.send({
        to,
        from,
        subject: 'Contact Form Submission',
        text: messageText,
    });
}

function initSendgrid() {
    const {
        SENDGRID_API_KEY: apiKey,
        SENDGRID_SENDER: from,
        CONTACT_TO_EMAIL_ADDRESS: to
    } = env();

    if (!from || !apiKey || !to) {
        throw new Error('Email not configured');
    }

    sgMail.setApiKey(apiKey);

    return { from, to };
}

function createEmailBody(form: ContactForm) {
    const { firstName, lastName, email, subject, message } = form;
    return `Name: ${firstName} ${lastName}\n\nEmail: ${email}\n\nSubject: ${subject}\n\nMessage: ${message}`
}