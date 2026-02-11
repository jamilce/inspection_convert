import { useT } from '../../contexts/I18nContext.tsx';

export const CreateEstablishmentPage = () => {
  const t = useT();

  return (
    <div className="block-header">
      <h2>{t('navigation.createNewEstablishment')}</h2>
      <div className="row clearfix">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="card">
            <div className="header">
              <h2>{t('navigation.createNewEstablishment')}</h2>
            </div>
            <div className="body">
              <p>Create establishment form will be displayed here.</p>
              {/* TODO: Implement establishment creation from legacy views/createEstablishment */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
