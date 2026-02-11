import { useT } from '../../contexts/I18nContext.tsx';
import { useAuth } from '../../contexts/AuthContext.tsx';

export const ProfilePage = () => {
  const t = useT();
  const { user } = useAuth();

  return (
    <div className="block-header">
      <h2>{t('navigation.profile')}</h2>
      <div className="row clearfix">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="card">
            <div className="header">
              <h2>{t('navigation.profile')}</h2>
            </div>
            <div className="body">
              <p>User profile information will be displayed here.</p>
              {user && (
                <div>
                  <p><strong>{t('auth.username')}:</strong> {user.FullName}</p>
                  <p><strong>{t('establishment.department')}:</strong> {user.DeptNameEn || user.DeptNameAr}</p>
                </div>
              )}
              {/* TODO: Implement profile from legacy views/admin/profile */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
