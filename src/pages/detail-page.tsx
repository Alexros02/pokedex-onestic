import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DetailCard from '../Components/detail-card';

const DetailPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 backdrop-blur px-3 py-1.5 text-sm text-gray-800 dark:text-gray-200 hover:bg-white/30 transition shadow-md"
        >
          <ChevronLeft className="h-4 w-4" /> Volver
        </button>
      </div>
      <DetailCard />
    </div>
  );
};

export default DetailPage;
