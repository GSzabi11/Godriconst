'use client';

import { motion } from 'framer-motion';
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
  gap: 40px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 30px;
    padding: 40px 20px;
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

  @media (max-width: 768px) {
    padding: 0 16px;
    margin-top: 20px;
  }
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
      <section className="relative flex items-center justify-center h-[70vh] bg-gray-900">
        <div className="absolute inset-0">
          <img
            src="/assets/images/first_landing.jpg"
            alt="Contact Background"
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl px-6 py-12 rounded-2xl shadow-xl backdrop-blur-md bg-white/10 border border-white/20"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-wide drop-shadow font-light tracking-widest uppercase">
            {t('heading')}
          </h1>
          <p className="text-white mt-4 text-lg md:text-xl opacity-90 font-extralight tracking-wide italic">
            {t('subheading')}
          </p>
          <div className="mt-6 h-1 w-16 mx-auto bg-white rounded-full opacity-80" />
        </motion.div>
      </section>

      <HeroSection>
        <IntroText>
          <div className="container mx-auto">
            <HeroTitle>{t('title')}</HeroTitle>

            <section className="bg-[#d8cdcd] w-full py-10">
              <div className="max-w-md rounded bg-white p-5 shadow text-left space-y-2">
                <p>
                  <span className="font-semibold">Phone:</span>
                  {' '}
                  <a href="tel:+40722971124" className="text-blue-600 hover:underline">
                    +40 722 971 124
                  </a>
                </p>
                <p>
                  <span className="font-semibold">Email:</span>
                  {' '}
                  <a
                    href="mailto:godri11@yahoo.com"
                    className="text-blue-600 hover:underline"
                  >
                    godri11@yahoo.com
                  </a>
                </p>
              </div>
            </section>
          </div>
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
          <HeroDescription>{t('description')}</HeroDescription>
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
