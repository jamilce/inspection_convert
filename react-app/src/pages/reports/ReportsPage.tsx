import { useT } from '../../contexts/I18nContext.tsx';

export const ReportsPage = () => {
  const t = useT();

  return (
    <div className="block-header">
      <h2>{t('common.reports')}</h2>
      <div className="row clearfix">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="card">
            <div className="header">
              <h2>{t('common.reports')}</h2>
            </div>
            <div className="body">
              <p>Reports listing and filtering will be displayed here.</p>
              {/* TODO: Implement reports from legacy views/report */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
