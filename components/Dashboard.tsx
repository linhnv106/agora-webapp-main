import { SignInButton } from './common/Buttons';

function Dashboard() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Hello there</h1>
          <p className="py-6">
            {
              'Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae eta id nisi.'
            }
          </p>
          <SignInButton />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
