import { ContactForm, SendContactEmailRequest, SendContactEmailResponse } from "living-mile-high-lib";
import { ExpressEndpoint } from "~/@types";
import { ContactLogRecord } from "~/@types/database";
import { services } from "~/di";
import sgMail from "@sendgrid/mail";
import env from "~/config/env";

const contactLogService = () => services().contactLogService;

export const sendContactEmail: ExpressEndpoint = async (req, res) => {
    const body: SendContactEmailRequest = req.body;
    const contactForm: ContactForm = body;

    try {
        const {
            SENDGRID_API_KEY,
            SENDGRID_SENDER,
            CONTACT_TO_EMAIL_ADDRESS
        } = env();

        if (!SENDGRID_SENDER || !SENDGRID_API_KEY || !CONTACT_TO_EMAIL_ADDRESS) {
            throw new Error('Email not configured');
        }

        sgMail.setApiKey(SENDGRID_API_KEY);

        if (!req.ip) {
            throw new Error('IP not found');
        }

        const log: ContactLogRecord = {
            ip: req.ip,
            email: contactForm.email,
            createdAt: new Date(),
        };

        const canSendEmail = await contactLogService().canSendEmail(log);

        if (!canSendEmail) {
            throw new Error('Email already sent within the last day');
        }

        const msg = {
            to: CONTACT_TO_EMAIL_ADDRESS,
            from: SENDGRID_SENDER,
            subject: 'Contact Form Submission',
            text: createEmailBody(contactForm),
        };

        await sgMail.send(msg);

        await contactLogService().logEmail(log);

        const successResponse: SendContactEmailResponse = { success: true };
        res.json(successResponse);
    } catch (error: any) {
        const errorResponse: SendContactEmailResponse = { success: false, error: error.message };
        console.log(errorResponse);
        res.json(errorResponse);
    }
}

function createEmailBody(form: ContactForm) {
    const { firstName, lastName, email, subject, message } = form;
    return `Name: ${firstName} ${lastName}\n\nEmail: ${email}\n\nSubject: ${subject}\n\nMessage: ${message}`
}