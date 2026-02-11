import { useT } from '../../contexts/I18nContext.tsx';

export const EmployeesPage = () => {
  const t = useT();

  return (
    <div className="block-header">
      <h2>{t('navigation.employees')}</h2>
      <div className="row clearfix">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="card">
            <div className="header">
              <h2>{t('navigation.employees')}</h2>
            </div>
            <div className="body">
              <p>Employees list will be displayed here.</p>
              {/* TODO: Implement employees from legacy views/admin/employeelist */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
