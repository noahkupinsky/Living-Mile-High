import React, { useState } from 'react';
import { styled, View, Text, Input, TextArea, Button, YStack, XStack, Checkbox } from 'tamagui';
import { minV } from '@/utils/misc';

const Container = styled(YStack, {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
});

const Form = styled(View, {
    width: '100%',
});

const Success = styled(View, {
    width: '100%',
});

const SuccessContainer = styled(YStack, {
    backgroundColor: '$lightBg',
    borderColor: '$lightGray',
    borderWidth: '1px',
    borderRadius: '0',
    padding: minV(1),
    justifyContent: 'center',
    alignItems: 'center',
});

const SuccessText = styled(Text, {
    fontSize: '0.75rem',
    color: '$darkGray',
    textAlign: 'center',
    fontFamily: '$form',
});

const FormRow = styled(XStack, {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1vw',
    marginVertical: '0.3vh',
});

const FormColumn = styled(View, {
    flex: 1,
    marginHorizontal: '1vw',
});

const FormLabel = styled(Text, {
    fontSize: '0.75rem',
    color: '$lightGray',
    marginBottom: '0.2vh',
    fontFamily: '$form',
});

const StyledInput = styled(Input, {
    width: '100%',
    fontSize: '0.75rem',
    height: '2rem',
    backgroundColor: '$lightBg',
    borderColor: '$lightGray',
    color: '$darkGray',
    fontFamily: '$form',
    borderWidth: '1px',
    borderRadius: '0',
});

const StyledTextArea = styled(TextArea, {
    width: '100%',
    height: '6rem',
    fontSize: '0.75rem',
    backgroundColor: '$lightBg',
    borderColor: '$lightGray',
    fontFamily: '$form',
    color: '$darkGray',
    borderWidth: '1px',
    borderRadius: '0',
});

const SubmitContainer = styled(YStack, {
    backgroundColor: '$lightBg',
    borderColor: '$lightGray',
    borderWidth: '1px',
    borderRadius: '0',
    padding: minV(1),
    justifyContent: 'center',
    alignItems: 'center',
    hoverStyle: {
        backgroundColor: '$lightGray',
        borderColor: '$darkGray',
    },
    cursor: 'pointer',
});

const SubmitText = styled(Text, {
    fontSize: '0.75rem',
    color: '$darkGray',
    textAlign: 'center',
    fontFamily: '$form',
});

// post submit Thank you for contacting us!  We will be in touch very soon.

// form should email tina@livingmilehigh.com

// need to sanitize input

type ContactForm = {
    firstName: string;
    lastName: string;
    email: string;
    newsletter: boolean;
    subject: string;
    message: string;
}

const FORM_INPUTS = {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    subject: 'Subject',
    message: 'Message',
}

const validateForm = (form: ContactForm): string[] => {
    const errors: string[] = [];

    (Object.entries(form) as [keyof (typeof FORM_INPUTS), string][]).forEach(([key, value]) => {
        if (value === '') {
            errors.push(`${FORM_INPUTS[key]} cannot be empty.`);
        }
    });

    return errors;
}

const ContactForm = () => {
    const [form, setForm] = useState<ContactForm>({
        firstName: '',
        lastName: '',
        newsletter: false,
        email: '',
        subject: '',
        message: '',
    });
    const [successfullySubmitted, setSuccessfullySubmitted] = useState(false);

    const handleSubmit = (event: any) => {
        event.preventDefault();

        const errors = validateForm(form);

        if (errors.length === 0) {
            setSuccessfullySubmitted(true);
        } else {
            alert(errors.join('\n'));
        }
    };

    return (
        <Container>
            {!successfullySubmitted ? (
                <Form>
                    <FormRow>
                        <YStack width="100%">
                            <FormColumn>
                                <FormLabel>Name</FormLabel>
                            </FormColumn>
                            <XStack width="100%">
                                <FormColumn>
                                    <StyledInput
                                        onChange={(e: any) => setForm({ ...form, firstName: e.target.value })}
                                        placeholder="First Name" />
                                </FormColumn>
                                <FormColumn>
                                    <StyledInput
                                        onChange={(e: any) => setForm({ ...form, lastName: e.target.value })}
                                        placeholder="Last Name" />
                                </FormColumn>
                            </XStack>
                        </YStack>

                    </FormRow>
                    <FormRow marginBottom='0'>
                        <FormColumn>
                            <FormLabel>Email</FormLabel>
                            <StyledInput
                                onChange={(e: any) => setForm({ ...form, email: e.target.value })}
                                textContentType="emailAddress" placeholder="Email" />
                        </FormColumn>
                    </FormRow>

                    <FormRow>
                        <FormColumn>
                            <FormLabel>Subject</FormLabel>
                            <StyledInput
                                onChange={(e: any) => setForm({ ...form, subject: e.target.value })}
                                placeholder="Subject" />
                        </FormColumn>
                    </FormRow>
                    <FormRow>
                        <FormColumn>
                            <FormLabel>Message</FormLabel>
                            <StyledTextArea
                                onChange={(e: any) => setForm({ ...form, message: e.target.value })}
                                placeholder="Message" />
                        </FormColumn>
                    </FormRow>
                    <FormRow>
                        <FormColumn>
                            <SubmitContainer
                                onPress={handleSubmit}
                            >
                                <SubmitText >Submit</SubmitText>
                            </SubmitContainer>
                        </FormColumn>
                    </FormRow>
                </Form>
            ) : (
                <Success>
                    <FormRow>
                        <FormColumn>
                            <SuccessContainer>
                                <SuccessText >
                                    Thank you for contacting us!  We will be in touch very soon.
                                </SuccessText>
                            </SuccessContainer>
                        </FormColumn>
                    </FormRow>
                </Success>
            )}
        </Container>
    );
};

export default ContactForm;