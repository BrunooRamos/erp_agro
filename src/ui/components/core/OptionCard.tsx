import { Link } from 'react-router-dom';
import { MenuRoute } from '../../../interfaces';


export const OptionCard = ({ icon, title, to, description }: MenuRoute) => {
  return (
    <Link 
      to={to}
      className="block p-6 bg-zinc-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      <div className="flex flex-col items-center text-center">
        <i className={`${icon} text-4xl text-zinc-800 mb-4`}></i>
        <h2 className="text-xl font-semibold text-zinc-800 mb-2">{title}</h2>
        {description && (
          <p className="text-sm text-zinc-600">{description}</p>
        )}
      </div>
    </Link>
  );
};