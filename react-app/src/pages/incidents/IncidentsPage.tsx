import { useT } from '../../contexts/I18nContext.tsx';

export const IncidentsPage = () => {
  const t = useT();

  return (
    <div className="block-header">
      <h2>{t('incidents.incidents')}</h2>
      <div className="row clearfix">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="card">
            <div className="header">
              <h2>{t('incidents.incidents')}</h2>
            </div>
            <div className="body">
              <p>Incidents list will be displayed here.</p>
              {/* TODO: Implement incidents from legacy views/incidentmail */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
