import { useT } from '../../contexts/I18nContext.tsx';

export const HomePage = () => {
  const t = useT();

  return (
    <div className="block-header">
      <h2>{t('common.home')}</h2>
      <div className="row clearfix">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="card">
            <div className="header">
              <h2>
                {t('app.welcomeTo')} {t('app.projectName')}
              </h2>
            </div>
            <div className="body">
              <p>Main dashboard content will be displayed here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
