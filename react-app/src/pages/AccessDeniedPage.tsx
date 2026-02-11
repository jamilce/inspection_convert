import { Link } from 'react-router-dom';
import { useT } from '../contexts/I18nContext.tsx';

export const AccessDeniedPage = () => {
  const t = useT();

  return (
    <div className="block-header">
      <div className="row clearfix">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="card">
            <div className="body text-center">
              <h1>403</h1>
              <h3>{t('auth.accessDenied')}</h3>
              <p>{t('auth.notAuthorizedPage')}</p>
              <Link to="/home" className="btn btn-primary">
                {t('common.home')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
