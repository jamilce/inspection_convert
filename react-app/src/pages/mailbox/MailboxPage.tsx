import { useT } from '../../contexts/I18nContext.tsx';

export const MailboxPage = () => {
  const t = useT();

  return (
    <div className="block-header">
      <h2>{t('navigation.mailbox')}</h2>
      <div className="row clearfix">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="card">
            <div className="header">
              <h2>{t('navigation.inbox')}</h2>
            </div>
            <div className="body">
              <p>Mailbox and notifications will be displayed here.</p>
              {/* TODO: Implement mailbox from legacy views/mailbox */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
