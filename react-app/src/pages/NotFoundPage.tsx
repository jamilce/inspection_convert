import { Link } from 'react-router-dom';

export const NotFoundPage = () => {

  return (
    <div className="block-header">
      <div className="row clearfix">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="card">
            <div className="body text-center">
              <h1>404</h1>
              <h3>Page Not Found</h3>
              <p>The page you are looking for does not exist.</p>
              <Link to="/home" className="btn btn-primary">
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
