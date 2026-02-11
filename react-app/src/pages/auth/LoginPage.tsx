import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { useI18n } from '../../contexts/I18nContext.tsx';
import toast from 'react-hot-toast';

interface LoginFormData {
  username: string;
  password: string;
}

export const LoginPage = () => {
  const { login } = useAuth();
  const { t, language, setLanguage } = useI18n();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.username, data.password);
      toast.success(t('common.successDone'));
      navigate('/home');
    } catch (error: any) {
      const message = error.response?.data?.message || t('common.errorMsg');
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="logo">
          <a href="/">
            <b>{t('app.projectName')}</b>
          </a>
          <small>{t('app.welcomeTo')}</small>
        </div>
        <div className="card">
          <div className="body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="msg">{t('auth.login')}</div>

              <div className="input-group">
                <span className="input-group-addon">
                  <i className="material-icons">person</i>
                </span>
                <div className="form-line">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={t('auth.username')}
                    {...register('username', {
                      required: t('common.required'),
                    })}
                  />
                </div>
              </div>
              {errors.username && (
                <span className="text-danger">{errors.username.message}</span>
              )}

              <div className="input-group">
                <span className="input-group-addon">
                  <i className="material-icons">lock</i>
                </span>
                <div className="form-line">
                  <input
                    type="password"
                    className="form-control"
                    placeholder={t('auth.password')}
                    {...register('password', {
                      required: t('common.required'),
                    })}
                  />
                </div>
              </div>
              {errors.password && (
                <span className="text-danger">{errors.password.message}</span>
              )}

              <div className="row">
                <div className="col-xs-8"></div>
                <div className="col-xs-4">
                  <button
                    type="submit"
                    className="btn btn-block bg-pink waves-effect"
                    disabled={isLoading}
                  >
                    {isLoading ? t('common.loading') : t('auth.login')}
                  </button>
                </div>
              </div>

              <div className="row m-t-15 m-b--20">
                <div className="col-xs-12">
                  <button
                    type="button"
                    onClick={toggleLanguage}
                    className="btn btn-link"
                  >
                    {language === 'en' ? (
                      <>عربى <img src="/images/uae.png" width="20" alt="UAE" /></>
                    ) : (
                      <><img src="/images/uk.png" width="20" alt="UK" /> English</>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
