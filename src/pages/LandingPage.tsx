import { ROUTE_PATHS } from '@/constants/routepaths';
import { useSession } from '@/features/auth/context/useSession';
import type { Member } from '@/features/members/types/types';
import {
  ArrowDown,
  BarChart3,
  BookOpen,
  CheckCircle,
  FileText,
  MessageSquare,
  Quote,
  Sparkles,
  Video,
  Workflow,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router';

const BRAND = '#3f3f3f';

const FEATURES = [
  {
    title: '매일 키워드 제공',
    desc: (
      <>
        키워드 · 관련 기사 · 관련 영상까지
        <br />한 번에 제공합니다
      </>
    ),
    Icon: BookOpen,
  },
  {
    title: '리뷰 & 피드백',
    desc: (
      <>
        나의 생각을 기록하고
        <br />
        동료 학습자와 상호작용
      </>
    ),
    Icon: MessageSquare,
  },
  {
    title: 'AI 요약 & 퀴즈',
    desc: (
      <>
        기사 요약과 퀴즈로
        <br />
        핵심만 정리하고 복습
      </>
    ),
    Icon: FileText,
  },
  {
    title: '학습 성취도',
    desc: (
      <>
        통계와 그래프로
        <br />
        나의 성장 데이터 확인
      </>
    ),
    Icon: BarChart3,
  },
] as const;

const FLOW_STEPS = [
  { step: '키워드 확인', Icon: BookOpen },
  { step: '기사 읽기', Icon: FileText },
  { step: '영상 시청', Icon: Video },
  { step: '리뷰 작성', Icon: MessageSquare },
  { step: '퀴즈 풀이', Icon: CheckCircle },
  { step: '성취도 확인', Icon: BarChart3 },
] as const;

const TESTIMONIAL_IDS = [1, 2, 3, 4] as const;

export default function LearningMateLanding() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const { provideSession } = useSession();
  const [isLanding, setIsLanding] = useState(false);
  const navigate = useNavigate();
  const member = useLoaderData<Member | null>();

  useEffect(() => {
    if (member) {
      provideSession(member);
      navigate(ROUTE_PATHS.MAIN);
    } else {
      setIsLanding(true);
    }
  }, []);

  return !isLanding ? null : (
    <div
      className='min-h-screen bg-white scroll-smooth relative'
      style={{ color: BRAND }}
    >
      <div
        aria-hidden
        className='pointer-events-none fixed inset-0 -z-10 opacity-[0.06] [background-image:radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]'
      />

      <header className='sticky top-0 z-40 w-full backdrop-blur bg-white/75 border-b'>
        <div className='mx-auto max-w-6xl px-4 h-14 flex items-center justify-between'>
          <a
            href='#home'
            className='font-bold tracking-tight'
            style={{ color: BRAND }}
          >
            LearningMate
          </a>
          <nav
            className='hidden md:flex items-center gap-6 text-sm'
            style={{ color: BRAND }}
          >
            <a href='#features' className='hover:opacity-80'>
              기능
            </a>
            <a href='#flow' className='hover:opacity-80'>
              학습흐름
            </a>
            <a href='#testimonials' className='hover:opacity-80'>
              후기
            </a>
            <a
              href='/login'
              className='px-3 py-1.5 rounded-xl text-white font-medium hover:opacity-90 text-sm'
              style={{ backgroundColor: BRAND }}
            >
              시작하기
            </a>
          </nav>
        </div>
      </header>

      <section
        id='home'
        className='relative overflow-hidden mx-auto max-w-6xl px-4 py-16 sm:py-20 text-center scroll-mt-20'
      >
        <div className="absolute inset-0 opacity-5 bg-[url('https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=60')] bg-cover bg-center" />
        <div className='relative'>
          <p className='text-[11px] sm:text-xs uppercase tracking-widest flex items-center justify-center gap-2 font-semibold'>
            <Sparkles className='h-4 w-4' /> 경제 스터디를 더 쉽게
          </p>
          <h1
            className='mt-2 text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight break-words max-w-3xl mx-auto'
            style={{ wordBreak: 'keep-all' }}
          >
            매일 10분,{' '}
            <span className='bg-yellow-300 px-2 rounded'>경제 공부 습관</span>{' '}
            만들기
          </h1>
          <p className='mt-3 sm:mt-4 text-[13px] sm:text-lg'>
            시의성 있는 키워드를 영상과 기사로 쉽고 빠르게 이해하고, <br />
            리뷰와 퀴즈로 학습을 완성하세요.
          </p>
          <div className='mt-5 sm:mt-6 flex items-center justify-center'>
            <a
              href='/login'
              className='px-4 py-2 sm:px-5 sm:py-3 rounded-xl text-white font-semibold shadow hover:opacity-90 text-sm sm:text-base'
              style={{ backgroundColor: BRAND }}
            >
              시작하기
            </a>
          </div>
        </div>
      </section>

      <section
        id='features'
        className='bg-gray-50 border-y scroll-mt-20 relative'
      >
        <div className='relative mx-auto max-w-6xl px-4 py-14 sm:py-16'>
          <h2
            className='flex items-center justify-center gap-2 text-xl sm:text-2xl md:text-3xl font-bold text-center'
            style={{ color: BRAND }}
          >
            <Sparkles className='h-5 w-5 text-yellow-400' /> LearningMate가
            특별한 이유
          </h2>

          <div className='mt-8 sm:mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6'>
            {FEATURES.map(({ title, desc, Icon }) => (
              <div
                key={title}
                className='relative p-6 bg-white rounded-2xl border shadow-sm text-center'
              >
                <div className='h-16 w-16 sm:h-20 sm:w-20 mx-auto flex flex-col items-center justify-center rounded-full bg-yellow-400 border border-yellow-300 mb-4 text-white'>
                  <Icon className='h-6 w-6 text-white' />
                </div>
                <h3 className='font-bold' style={{ color: BRAND }}>
                  {title}
                </h3>
                <p className='mt-2 text-[13px] leading-relaxed'>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flow */}
      <section
        id='flow'
        className='mx-auto max-w-6xl px-4 py-14 sm:py-16 scroll-mt-20 relative'
      >
        <div className='relative'>
          <h2
            className='flex items-center justify-center gap-2 text-xl sm:text-2xl md:text-3xl font-bold text-center'
            style={{ color: BRAND }}
          >
            <Workflow className='h-5 w-5 text-yellow-500' /> 학습 흐름
          </h2>
          <div className='mt-8 sm:mt-10'>
            <div className='sm:hidden px-10'>
              {FLOW_STEPS.map(({ step, Icon }, i, arr) => (
                <div key={step} className='flex flex-col items-center w-full'>
                  <div className='flex items-center gap-3 rounded-xl border bg-white/80 backdrop-blur px-4 py-3 w-full'>
                    <div className='h-10 w-10 rounded-full bg-yellow-400 border border-yellow-300 flex items-center justify-center'>
                      <Icon className='h-5 w-5 text-white' />
                    </div>
                    <span
                      className='text-sm font-medium'
                      style={{ color: BRAND }}
                    >
                      {step}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className='flex items-center justify-center py-2'>
                      <ArrowDown className='h-6 w-6 text-gray-600 stroke-[3]' />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className='hidden sm:flex flex-wrap items-center justify-center gap-4 md:gap-6'>
              {FLOW_STEPS.map(({ step, Icon }, i, arr) => (
                <div key={step} className='flex items-center gap-3'>
                  <div
                    className='h-20 w-20 md:h-24 md:w-24 rounded-full bg-yellow-400 flex flex-col items-center justify-center border border-yellow-300 text-center font-medium text-xs md:text-sm'
                    style={{ color: BRAND }}
                  >
                    <Icon className='h-6 w-6 text-white' />
                    <span className='mt-1 px-2 leading-snug'>{step}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <span className='text-gray-400'>→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id='testimonials' className='bg-white scroll-mt-20 relative'>
        <div className='relative mx-auto max-w-6xl px-4 py-16'>
          <h2
            className='flex items-center justify-center gap-2 text-xl sm:text-2xl md:text-3xl font-bold'
            style={{ color: BRAND }}
          >
            <Quote className='h-5 w-5 text-yellow-400' /> 학습자 후기
          </h2>

          <div className='mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {TESTIMONIAL_IDS.map((i) => (
              <div
                key={i}
                className='rounded-2xl border p-6 bg-white/90 backdrop-blur-sm'
              >
                <div className='flex items-center gap-3'>
                  <img
                    src={`https://i.pravatar.cc/100?img=${i}`}
                    alt='avatar'
                    className='h-10 w-10 rounded-full'
                  />
                  <div>
                    <p className='font-extrabold' style={{ color: BRAND }}>
                      스터디원 {i}
                    </p>
                    <p className='text-xs'>3개월 연속 학습</p>
                  </div>
                </div>
                <p className='mt-4 text-sm leading-6'>
                  “매일 10분으로 경제 뉴스를 이해하는 루틴이 생겼어요. 퀴즈와
                  성취도 통계가 동기 부여에 좋아요.”
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id='cta'
        className='scroll-mt-20 relative'
        style={{ backgroundColor: '#facc15', color: BRAND }}
      >
        <div className='relative mx-auto max-w-6xl px-4 py-12 sm:py-16 text-center'>
          <h3
            className='flex items-center justify-center gap-2 text-xl sm:text-2xl md:text-3xl font-extrabold max-w-2xl mx-auto'
            style={{ color: BRAND }}
          >
            <Sparkles className='h-5 w-5 text-yellow-400' /> 오늘부터
            LearningMate와 함께 시작하세요
          </h3>
          <a
            href='/login'
            className='mt-6 inline-block px-5 py-2 sm:px-6 sm:py-3 rounded-xl text-white font-semibold shadow hover:opacity-90 text-sm sm:text-base'
            style={{ backgroundColor: BRAND }}
          >
            시작하기
          </a>
        </div>
      </section>

      <footer className='border-t'>
        <div className='mx-auto max-w-6xl px-4 h-16 flex items-center justify-center text-xs '>
          <span>© {year} LearningMate. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
