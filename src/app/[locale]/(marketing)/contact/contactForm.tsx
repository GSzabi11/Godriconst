'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

// Styled Components
const PageContainer = styled.div`
  font-family: 'Montserrat', sans-serif;
  background-color: #d8cdcd;
  color: #1c1c1c;
`;

const HeroSection = styled.section`
  display: flex;
  align-items: center;
  padding: 60px 10%;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;
const IntroText = styled.div`
  flex: 1;
`;
const HeroTitle = styled.h1`
  font-size: 48px;
  line-height: 1.2;
  margin-bottom: 20px;
`;
const HeroDescription = styled.p`
  font-size: 18px;
  line-height: 1.5;
`;
const HeroImage = styled.img`
  flex: 1;
  width: 100%;
  max-width: 500px;
  border-radius: 8px;
`;
const ContactSection = styled.section`
  display: flex;
  align-items: flex-start;
  padding: 60px 10%;
  gap: 40px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const FormWrapper = styled.div`
  flex: 1;
`;
const SectionTitle = styled.h2`
  font-size: 36px;
  margin-bottom: 20px;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const Label = styled.label`
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const Input = styled.input`
  padding: 10px;
  border: 1px solid #1c1c1c;
  border-radius: 4px;
  font-size: 16px;
`;
const Textarea = styled.textarea`
  padding: 10px;
  border: 1px solid #1c1c1c;
  border-radius: 4px;
  font-size: 16px;
  resize: vertical;
  min-height: 120px;
`;
const SubmitButton = styled.button`
  background-color: #1c1c1c;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  align-self: flex-start;
  &:hover {
    opacity: 0.9;
  }
`;
const StatusMessage = styled.p`
  font-size: 14px;
  margin-top: 8px;
`;
const Footer = styled.footer`
  background-color: #1c1c1c;
  color: white;
  text-align: center;
  padding: 20px;
`;
const SocialIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 10px;
`;
const SocialLink = styled.a`
  color: white;
  font-size: 24px;
  text-decoration: none;
`;

// ContactForm Component
type Status = 'idle' | 'sending' | 'sent' | 'error';
export default function ContactForm() {
  const t = useTranslations('Contact');
  const [status, setStatus] = React.useState<Status>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '', email: '', message: '' },
  });

  const onSubmit = async (data: {
    name: string;
    email: string;
    message: string;
  }) => {
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus('sent');
        reset();
      } else {
        throw new Error(await res.text());
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <PageContainer>
      <HeroSection>
        <IntroText>
          <HeroTitle>{t('title')}</HeroTitle>
          <HeroDescription>{t('description')}</HeroDescription>
        </IntroText>
        <HeroImage
          src="/assets/images/gerenda.jpg"
          alt="Intro Image"
          loading="lazy"
          draggable={false}
        />
      </HeroSection>

      <ContactSection>
        <FormWrapper>
          <SectionTitle>{t('form_title')}</SectionTitle>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Label>
              {t('name_label')}
              <Input {...register('name', { required: true })} required />
            </Label>
            {errors.name && <StatusMessage>{t('name_required')}</StatusMessage>}
            <Label>
              {t('email_label')}
              <Input
                type="email"
                {...register('email', { required: true })}
                required
              />
            </Label>
            {errors.email && (
              <StatusMessage>{t('email_required')}</StatusMessage>
            )}
            <Label>
              {t('message_label')}
              <Textarea {...register('message')} />
            </Label>
            <SubmitButton type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? t('sending') : t('submit')}
            </SubmitButton>
            {status === 'sent' && (
              <StatusMessage>{t('email_sent')}</StatusMessage>
            )}
            {status === 'error' && (
              <StatusMessage>{t('email_error')}</StatusMessage>
            )}
          </Form>
        </FormWrapper>
        <div>
          <HeroImage
            src="/assets/images/bathroom.jpg"
            alt="Contact Image"
            loading="lazy"
            draggable={false}
          />
        </div>
      </ContactSection>

      <Footer>
        <SocialIcons>
          <SocialLink href="#">
            <i className="fab fa-facebook-f" />
          </SocialLink>
          <SocialLink href="#">
            <i className="fab fa-instagram" />
          </SocialLink>
        </SocialIcons>
        <p>{t('footer_text')}</p>
      </Footer>
    </PageContainer>
  );
}
