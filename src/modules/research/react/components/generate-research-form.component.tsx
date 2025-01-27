import { Button } from '@/components/ui/button';
import { FC, useRef } from 'react';
import { Generate } from '@/modules/research/core/domain';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { reportQueryExamples } from '@/modules/research/core/domain/research.model';
import BetaTag from '@/modules/shared/react/components/beta-tag.component';

const GenerateResearchForm: FC<{ onSubmit: (form: Generate.Form) => void }> = ({ onSubmit }) => {
  const t = useTranslations('generateReport');
  const form = useForm<Generate.Form>({
    defaultValues: {
      query: '',
    },
    resolver: zodResolver(Generate.formSchema),
  });
  const { control, getValues, setValue, handleSubmit } = form;
  const queryRef = useRef<HTMLTextAreaElement | null>(null);

  const submit = (): void => {
    onSubmit(getValues());
  };

  const handleExample = (example: string) => (): void => {
    setValue('query', t(example));

    if (queryRef.current) {
      queryRef.current.focus();
    }
  };

  return (
    <Card className="m-auto w-full max-w-[1000px] border-none">
      <CardHeader>
        <CardTitle className="relative flex items-center gap-3">
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <div className="absolute right-[-15px] top-[-15px] lg:relative lg:right-0 lg:top-[3px]">
            <BetaTag />
          </div>
        </CardTitle>
        <CardDescription>
          <p>{t('description')}</p>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={handleSubmit(submit)}>
            <FormField
              control={control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea {...field} placeholder={t('queryPlaceholder')} ref={queryRef} rows={8} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-wrap justify-center gap-4">
              {reportQueryExamples.map((query) => (
                <Button key={query} className="h-fit" type="button" variant="outline" onClick={handleExample(query)}>
                  <span className="text-sm">{t(query)}</span>
                </Button>
              ))}
            </div>

            <Button className="w-full rounded-3xl font-semibold" size="lg" type="submit" onClick={handleSubmit(submit)}>
              {t('submitForm')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default GenerateResearchForm;
