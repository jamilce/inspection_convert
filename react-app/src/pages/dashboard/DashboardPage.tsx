import { useT } from '../../contexts/I18nContext.tsx';

export const DashboardPage = () => {
  const t = useT();

  return (
    <div className="block-header">
      <h2>{t('common.dashboard')}</h2>
      <div className="row clearfix">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="card">
            <div className="header">
              <h2>{t('common.dashboard')}</h2>
            </div>
            <div className="body">
              <p>Performance monitors and statistics will be displayed here.</p>
              {/* TODO: Implement dashboard widgets from legacy views/dashboard */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
