import { useTranslations } from 'next-intl';

const BetaTag = (): JSX.Element => {
  const t = useTranslations('common');

  return (
    <div className={'flex h-fit items-center rounded-xl border border-solid border-beige-50 bg-beige-100 px-2 py-1'}>
      <span className="text-sm font-semibold italic text-beige-500">{t('beta')}</span>
    </div>
  );
};

export default BetaTag;
