
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
import { Description } from './Description.js';

const ContactModal = dynamic(
    () => import('../modal/ContactModal.js').then((mod) => mod.ContactModal),
    { ssr: false },
);

export const Hero = () => {
    const { dict } = useDictionary();
    const reduceMotion = useReducedMotion();

    const heroText = getText('page.main.hero.title', dict);

    const entrance = reduceMotion
        ? {}
        : {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: {
                  duration: 0.7,
                  ease: 'easeOut' as const,
              },
          };

    const delayedEntrance = (delay: number) =>
        reduceMotion
            ? {}
            : {
                  initial: { opacity: 0, y: 16 },
                  animate: { opacity: 1, y: 0 },
                  transition: {
                      duration: 0.6,
                      delay,
                      ease: 'easeOut' as const,
                  },
              };

    return (
        <section
            id="hero"
            aria-labelledby="hero-title"
            className="
                site-container contain-layout
                relative z-20 flex min-h-[calc(100svh-5rem)]
                flex-col justify-center
                py-24 sm:min-h-[calc(100svh-6rem)]
                sm:py-28
            "
        >
            {/* Background decoration */}
            <div
                aria-hidden="true"
                className="
                    pointer-events-none absolute
                    right-[10%] top-1/2 hidden
                    h-[38rem] w-[38rem] -translate-y-1/2
                    rounded-full opacity-40 blur-3xl
                    sm:block
                "
                style={{
                    background:
                        'radial-gradient(circle, color-mix(in oklch, var(--site-accent) 12%, transparent), transparent 68%)',
                }}
            />

            <div className="relative z-10 max-w-5xl">
                {/* Eyebrow */}
                <motion.div
                    {...entrance}
                    className="
                        mb-8 flex flex-wrap items-center gap-3
                        font-mono text-[11px] uppercase
                        tracking-[0.18em]
                        text-[var(--site-subtle)]
                        ml-1
                    "
                >
                    <span className="
                        relative flex h-2 w-2 items-center justify-center
                    ">
                        <span className="
                            absolute h-full w-full animate-ping
                            rounded-full bg-[var(--site-accent)]/40
                        " />
                        <span className="
                            relative h-1.5 w-1.5 rounded-full
                            bg-[var(--site-accent)]
                        " />
                    </span>

                    <Text text="page.main.hero.eyebrow" />

                    <span className="
                        h-px w-8 bg-[var(--site-border)]
                    " />

                    <span>01 / 05</span>
                </motion.div>

                {/* Main heading */}
                <motion.div {...entrance}>
                    <h1
                        id="hero-title"
                        className="
                            gpu-accelerated max-w-5xl
                            text-left text-[clamp(3rem,8vw,7rem)]
                            font-semibold leading-[0.98]
                            tracking-[-0.065em]
                        "
                    >
                        <TextType text={[heroText]} />
                    </h1>

                    <motion.div
                        aria-hidden="true"
                        initial={reduceMotion ? false : { scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                            duration: reduceMotion ? 0 : 0.9,
                            delay: reduceMotion ? 0 : 0.3,
                            ease: 'easeOut',
                        }}
                        className="
                            mt-8 h-px w-24 origin-left
                            bg-[var(--site-accent)]
                            sm:mt-10 sm:w-32
                        "
                    />
                </motion.div>

                {/* Description */}
                <motion.div
                    {...delayedEntrance(0.25)}
                    className="
                        mt-6 max-w-2xl text-left
                        text-base leading-relaxed
                        text-[var(--site-muted)]
                        sm:mt-8 sm:text-lg
                    "
                >
                    <Description />
                </motion.div>

                {/* Actions */}
                <motion.div
                    {...delayedEntrance(0.4)}
                    className="
                        mt-9 flex flex-col items-stretch
                        gap-3 sm:mt-10 sm:flex-row
                        sm:items-center
                    "
                >
                    <Link href="/projects" className="inline-flex">
                        <Button
                            variant="default"
                            className="
                                group relative h-12 w-full
                                overflow-hidden rounded-lg
                                px-5 sm:w-auto
                            "
                        >
                            <span className="relative z-10">
                                <Text text="page.main.hero.button1" />
                            </span>

                            <GrowArrow
                                className="w-auto"
                                variant="right"
                                color="text-foreground bg-white group-hover:bg-white"
                            />

                            <span
                                aria-hidden="true"
                                className="
                                    absolute inset-0
                                    -translate-x-full
                                    bg-gradient-to-r
                                    from-transparent via-white/20
                                    to-transparent
                                    transition-transform duration-700
                                    group-hover:translate-x-full
                                "
                            />
                        </Button>
                    </Link>

                    <ContactModal>
                        <Button
                            variant="outline"
                            className="
                                group h-12 w-full rounded-lg
                                border-[var(--site-border)]
                                bg-white/[0.015] px-5
                                text-foreground
                                transition-all duration-300
                                hover:border-[var(--site-accent)]/40
                                hover:bg-white/[0.04]
                                sm:w-auto
                            "
                        >
                            <Mail className="
                                mr-2 h-4 w-4
                                transition-transform duration-300
                                group-hover:-rotate-6
                            " />

                            <Text text="page.main.hero.button2" />
                        </Button>
                    </ContactModal>
                </motion.div>

                {/* Bottom information */}
                <motion.div
                    {...delayedEntrance(0.55)}
                    className="
                        mt-16 flex flex-col gap-4
                        border-t border-[var(--site-border)]
                        pt-5 sm:mt-20
                        sm:flex-row sm:items-center
                        sm:justify-between
                    "
                >
                    <span className="
                        font-mono text-[10px]
                        uppercase tracking-[0.16em]
                        text-[var(--site-subtle)]
                    ">
                        Based on curiosity. Built with code.
                    </span>

                    <a
                        href="#experience"
                        className="
                            group inline-flex items-center gap-3
                            font-mono text-[10px] uppercase
                            tracking-[0.16em]
                            text-[var(--site-muted)]
                            transition-colors duration-300
                            hover:text-[var(--site-accent)]
                        "
                    >
                        <Text text="page.main.hero.scroll" />

                        <ArrowDown className="
                            h-4 w-4
                            transition-transform duration-300
                            group-hover:translate-y-1
                        " />
                    </a>
                </motion.div>
            </div>
        </section>
    );
};
