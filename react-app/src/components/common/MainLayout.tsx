import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { useI18n } from '../../contexts/I18nContext.tsx';

export const MainLayout = () => {
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useI18n();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <div className="theme-red">
      {/* Top Bar */}
      <nav className="navbar">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="/">
              {t('app.projectName')}
            </a>
          </div>
          <div className="collapse navbar-collapse">
            <ul className="nav navbar-nav navbar-right">
              <li>
                <button onClick={toggleLanguage} className="btn btn-link">
                  {language === 'en' ? (
                    <>عربى <img src="/images/uae.png" width="20" alt="UAE" /></>
                  ) : (
                    <><img src="/images/uk.png" width="20" alt="UK" /> English</>
                  )}
                </button>
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-link">
                  <i className="material-icons">input</i>
                  <span>{t('common.signOut')}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <section>
        <aside id="leftsidebar" className="sidebar">
          {/* User Info */}
          <div className="user-info">
            <div className="info-container">
              <div className="name" data-toggle="dropdown">
                {user?.FullName || 'User'}
              </div>
              <div className="email">{user?.JobTitle || ''}</div>
            </div>
          </div>

          {/* Menu */}
          <div className="menu">
            <ul className="list" style={{ listStyle: 'none' }}>
              <li className="header">
                <span>{t('navigation.mainNavigation')}</span>
              </li>
              <li>
                <Link to="/home">
                  <i className="material-icons">home</i>
                  <span>{t('common.home')}</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard">
                  <i className="material-icons">dashboard</i>
                  <span>{t('common.dashboard')}</span>
                </Link>
              </li>
              <li>
                <Link to="/audits/create">
                  <i className="material-icons">add_to_photos</i>
                  <span>{t('navigation.createNewAudit')}</span>
                </Link>
              </li>
              <li>
                <Link to="/establishments/create">
                  <i className="material-icons">add</i>
                  <span>{t('navigation.createNewEstablishment')}</span>
                </Link>
              </li>
              <li>
                <Link to="/mailbox">
                  <i className="material-icons">inbox</i>
                  <span>{t('navigation.mailbox')}</span>
                </Link>
              </li>
              <li>
                <Link to="/reports">
                  <i className="material-icons">assessment</i>
                  <span>{t('common.reports')}</span>
                </Link>
              </li>
              <li>
                <Link to="/incidents">
                  <i className="material-icons">warning</i>
                  <span>{t('navigation.incidents')}</span>
                </Link>
              </li>
              <li>
                <Link to="/employees">
                  <i className="material-icons">people</i>
                  <span>{t('navigation.employees')}</span>
                </Link>
              </li>
              <li>
                <Link to="/notifications">
                  <i className="material-icons">notifications</i>
                  <span>{t('common.notification')}</span>
                </Link>
              </li>
              <li>
                <Link to="/profile">
                  <i className="material-icons">person</i>
                  <span>{t('navigation.profile')}</span>
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </section>

      {/* Main Content */}
      <section className="content">
        <div className="container-fluid">
          <Outlet />
        </div>
      </section>
    </div>
  );
};
