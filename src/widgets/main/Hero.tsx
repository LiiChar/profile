'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowDown, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text-client';
import { GrowArrow } from '@/components/ui/grow-arrow';
import TextType from '@/components/ui/text-type';
import { getText } from '@/helpers/i18n-client';
import { useDictionary } from '@/stores/lang/langProvider';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const ContactModal = dynamic(
  () => import('../modal/ContactModal.js').then((mod) => mod.ContactModal),
  { ssr: false },
);

export const Hero = () => {
  const { dict } = useDictionary();
  const reduceMotion = useReducedMotion();

  const fadeIn = reduceMotion
    ? { initial: {}, animate: {}, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.65, ease: 'easeOut' as const },
      };

  const lineIn = reduceMotion
    ? { initial: {}, animate: {}, transition: { duration: 0 } }
    : {
        initial: { scaleX: 0 },
        animate: { scaleX: 1 },
        transition: { duration: 0.85, delay: 0.35, ease: 'easeOut' as const },
      };

  const actionsIn = reduceMotion
    ? { initial: {}, animate: {}, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.55, delay: 0.45 },
      };

  const description = getText('page.main.hero.description', dict);

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="site-container relative z-20 flex min-h-[calc(100svh-5rem)] flex-col justify-center overflow-hidden py-24 sm:min-h-[calc(100svh-6rem)] sm:py-28 contain-layout"
    >
      {/* Subtle background detail keeps the hero connected to the rest of the page. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklch, var(--site-accent) 10%, transparent), transparent 68%)',
        }}
      />

      <div className="relative z-10 max-w-5xl">
        <motion.div {...fadeIn}>
          <h1
            id="hero-title"
            className="gpu-accelerated max-w-5xl text-left"
          >
            <Text text="page.main.hero.title" />
          </h1>

          <motion.div
            {...lineIn}
            aria-hidden="true"
            className="mt-8 h-px w-24 origin-left bg-primary sm:mt-10 sm:w-32"
          />
        </motion.div>

        <motion.div
          {...actionsIn}
          className="mt-7 max-w-2xl text-left text-base leading-relaxed text-muted-foreground sm:mt-8 sm:text-lg"
        >
          {reduceMotion ? (
            <span>{description}</span>
          ) : (
            <TextType text={[description]} />
          )}
        </motion.div>

        <motion.div
          {...actionsIn}
          className="mt-9 flex flex-col items-stretch gap-3 sm:mt-10 sm:flex-row sm:items-center"
        >
          <Link href="/projects" className="inline-flex">
            <Button
              variant="default"
              className="group relative h-12 w-full overflow-hidden rounded-lg px-5 sm:w-auto"
            >
              <span className="relative z-10">
                <Text text="page.main.hero.button1" />
              </span>

              <GrowArrow
                variant="right"
                color="text-foreground bg-white group-hover:bg-background"
              />

              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
            </Button>
          </Link>

          <ContactModal>
            <Button
              variant="outline"
              className="group h-12 w-full rounded-lg border-border bg-background/40 px-5 text-foreground transition-colors duration-300 hover:border-primary/50 hover:bg-accent/40 sm:w-auto"
            >
              <Mail className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-rotate-6" />
              <Text text="page.main.hero.button2" />
            </Button>
          </ContactModal>
        </motion.div>
      </div>

      <a
        href="#description"
        aria-label="Scroll down to description"
        className="group absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground transition-colors duration-300 hover:text-primary sm:bottom-10"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
          Scroll
        </span>
        <ArrowDown className="h-4 w-4 float-animation" strokeWidth={1.5} />
      </a>
    </section>
  );
};
