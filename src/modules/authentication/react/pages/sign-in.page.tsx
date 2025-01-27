import { ChartLine } from 'lucide-react';
import type { FC } from 'react';
import { LinkupLogoWithName } from '@/modules/shared/react/components/linkup-logo-with-name.component';
import { useTranslations } from 'next-intl';

const SignInPage: FC = () => {
  const t = useTranslations('signIn');

  return (
    <div className="flex h-[100dvh]">
      <div className="hidden w-1/2 flex-col justify-center gap-8 bg-beige-100 px-10 lg:flex">
        <div className="w-fit rounded-2xl bg-beige-50 p-4">
          <ChartLine />
        </div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>

        <p className="font-semibold">{t('productDescription')}</p>
      </div>
      <div className="flex w-full flex-col justify-center lg:w-1/2">
        <div className="m-auto flex max-w-[400px] flex-col gap-5 p-4">
          <LinkupLogoWithName width={220} />
          <p className="font-semibold text-primary">{t('description')}</p>
          <a
            className="h-9 rounded-3xl bg-green-700 px-4 py-2 text-center text-md text-white hover:bg-green-900"
            href={`${process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://app.linkup.so'}/sign-in?utm_source=market_research`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="text-md">{t('signIn')}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
