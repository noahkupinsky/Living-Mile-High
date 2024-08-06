import { SendContactEmailRequest, SendContactEmailResponse } from "living-mile-high-lib";
import { ExpressEndpoint } from "~/@types";
import { ContactLogRecord } from "~/@types/database";
import { services } from "~/di";
import nodemailer from "nodemailer";
import env from "~/config/env";

const contactLogService = () => services().contactLogService;

export const sendContactEmail: ExpressEndpoint = async (req, res) => {
    const body: SendContactEmailRequest = req.body;
    const { firstName, lastName, subject, email, message } = body;

    try {
        if (!req.ip) {
            throw new Error('IP not found');
        }

        const log: ContactLogRecord = {
            ip: req.ip,
            email,
            createdAt: new Date(),
        };

        const canSendEmail = await contactLogService().canSendEmail(log);

        if (!canSendEmail) {
            throw new Error('Email already sent within the last day');
        }

        await contactLogService().logEmail(log);

        const {
            CONTACT_FROM_EMAIL_ADDRESS,
            CONTACT_FROM_EMAIL_PASSWORD,
            CONTACT_TO_EMAIL_ADDRESS
        } = env();

        if (!CONTACT_FROM_EMAIL_ADDRESS || !CONTACT_FROM_EMAIL_PASSWORD || !CONTACT_TO_EMAIL_ADDRESS) {
            throw new Error('Email not configured');
        }

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: CONTACT_FROM_EMAIL_ADDRESS,
                pass: CONTACT_FROM_EMAIL_PASSWORD,
            },
        });

        let mailOptions = {
            from: CONTACT_FROM_EMAIL_ADDRESS,
            to: CONTACT_TO_EMAIL_ADDRESS,
            subject: subject,
            text: `Name: ${firstName} ${lastName}\nEmail: ${email}\n\nMessage: ${message}`,
        };

        await transporter.sendMail(mailOptions);

        const successResponse: SendContactEmailResponse = { success: true };
        res.json(successResponse);
    } catch (error: any) {
        const errorResponse: SendContactEmailResponse = { success: false, error: error.message };
        console.log(errorResponse);
        res.json(errorResponse);
    }
}